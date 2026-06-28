<script lang="ts">
	import type { PageData } from './$types';
	import type { DeezerTrack } from '$lib/types/deezer';

	let { data } = $props<{ data: PageData }>();

	const tracks = $derived(data.album.tracks?.data || []);

	// State
	let scores = $state<Record<number, number>>({});
	let matchCount = $state(0);
	let maxMatches = $derived(Math.max(10, tracks.length * 2));

	let trackA = $state<DeezerTrack | null>(null);
	let trackB = $state<DeezerTrack | null>(null);

	let finished = $state(false);

	let audioElA = $state<HTMLAudioElement | null>(null);
	let audioElB = $state<HTMLAudioElement | null>(null);
	let playingA = $state(false);
	let playingB = $state(false);

	// Initialize scores on load
	$effect(() => {
		if (tracks.length > 0 && Object.keys(scores).length === 0) {
			const initialScores: Record<number, number> = {};
			tracks.forEach((track: DeezerTrack) => {
				initialScores[track.id] = 1200; // Rating de base Elo
			});
			scores = initialScores;
			nextMatch();
		}
	});

	function stopAllAudio() {
		if (audioElA) {
			audioElA.pause();
			playingA = false;
		}
		if (audioElB) {
			audioElB.pause();
			playingB = false;
		}
	}

	function playTrack(type: 'A' | 'B', previewUrl: string) {
		stopAllAudio();

		if (type === 'A') {
			audioElA = new Audio(previewUrl);
			audioElA.play();
			playingA = true;
			audioElA.onended = () => (playingA = false);
		} else {
			audioElB = new Audio(previewUrl);
			audioElB.play();
			playingB = true;
			audioElB.onended = () => (playingB = false);
		}
	}

	function nextMatch() {
		if (matchCount >= maxMatches) {
			stopAllAudio();
			finished = true;
			return;
		}

		// Sélectionner deux pistes aléatoires avec des scores proches pour un tri plus précis
		const sortedTracks = [...tracks].sort(
			(a, b) => (scores[b.id] || 1200) - (scores[a.id] || 1200)
		);

		// Choisir un index de base aléatoire
		const baseIdx = Math.floor(Math.random() * (sortedTracks.length - 1));
		trackA = sortedTracks[baseIdx];
		trackB = sortedTracks[baseIdx + 1];

		// S'assurer de ne pas trier le même son
		if (trackA && trackB && trackA.id === trackB.id) {
			trackB = sortedTracks[(baseIdx + 2) % sortedTracks.length];
		}
	}

	function vote(winnerId: number, loserId: number) {
		stopAllAudio();

		const ratingW = scores[winnerId] || 1200;
		const ratingL = scores[loserId] || 1200;

		// Calcul Elo
		const expectedW = 1 / (1 + Math.pow(10, (ratingL - ratingW) / 400));
		const expectedL = 1 / (1 + Math.pow(10, (ratingW - ratingL) / 400));

		const K = 32;
		scores[winnerId] = Math.round(ratingW + K * (1 - expectedW));
		scores[loserId] = Math.round(ratingL + K * (0 - expectedL));

		matchCount += 1;
		nextMatch();
	}

	function restart() {
		scores = {};
		matchCount = 0;
		finished = false;
		stopAllAudio();

		const initialScores: Record<number, number> = {};
		tracks.forEach((track: DeezerTrack) => {
			initialScores[track.id] = 1200;
		});
		scores = initialScores;
		nextMatch();
	}

	const finalRanking = $derived(
		[...tracks].sort((a, b) => (scores[b.id] || 1200) - (scores[a.id] || 1200))
	);
</script>

<svelte:head>
	<title>SoundSorter - {data.album.title}</title>
</svelte:head>

<div class="mx-auto max-w-2xl space-y-8">
	<!-- Go Back -->
	<a
		href="/album/{data.album.id}"
		class="inline-flex items-center gap-2 text-sm font-semibold text-slate-400 transition-colors hover:text-white"
	>
		<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M10 19l-7-7m0 0l7-7m-7 7h18"
			/>
		</svg>
		Retour à l'album
	</a>

	<!-- Header -->
	<div class="space-y-2 text-center">
		<h1
			class="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-3xl font-extrabold text-transparent"
		>
			SoundSorter
		</h1>
		<p class="text-sm text-slate-400">
			Classez les titres de l'album <strong>{data.album.title}</strong> par vos préférences.
		</p>
	</div>

	{#if tracks.length < 2}
		<div class="rounded-2xl border border-slate-800 bg-slate-900 p-8 text-center text-slate-400">
			Cet album n'a pas assez de pistes pour être trié.
		</div>
	{:else if !finished && trackA && trackB}
		<!-- Progress Bar -->
		<div class="space-y-2">
			<div
				class="flex justify-between text-xs font-semibold tracking-wider text-slate-400 uppercase"
			>
				<span>Progression du tri</span>
				<span>Match {matchCount + 1} / {maxMatches}</span>
			</div>
			<div class="h-2 w-full overflow-hidden rounded-full border border-slate-800 bg-slate-900">
				<div
					class="h-full bg-violet-600 transition-all duration-300"
					style="width: {(matchCount / maxMatches) * 100}%"
				></div>
			</div>
		</div>

		<!-- Matchup Cards -->
		<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
			<!-- Track A -->
			<div
				class="flex flex-col items-center justify-between space-y-6 rounded-2xl border border-slate-800 bg-slate-900/50 p-6 text-center shadow-lg transition-colors hover:border-violet-500/50"
			>
				<div class="flex flex-grow flex-col justify-center space-y-2">
					<span class="text-xs font-bold tracking-widest text-slate-500 uppercase">Option A</span>
					<h3 class="text-xl font-bold text-slate-100">{trackA.title}</h3>
					<p class="text-sm text-slate-400">{trackA.artist.name}</p>
				</div>

				<div class="flex w-full flex-col gap-3">
					<button
						onclick={() => playTrack('A', trackA!.preview)}
						class="hover:bg-slate-850 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-800 bg-slate-950 py-2.5 text-sm font-semibold transition-colors hover:text-white"
					>
						{#if playingA}
							<svg class="h-4 w-4 text-violet-400" fill="currentColor" viewBox="0 0 24 24">
								<path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
							</svg>
							Pause extrait
						{:else}
							<svg class="h-4 w-4 text-violet-400" fill="currentColor" viewBox="0 0 24 24">
								<path d="M8 5v14l11-7z" />
							</svg>
							Écouter l'extrait
						{/if}
					</button>

					<button
						onclick={() => vote(trackA!.id, trackB!.id)}
						class="w-full rounded-xl bg-violet-600 py-3 text-sm font-bold text-white shadow-md shadow-violet-900/30 transition-all hover:bg-violet-500"
					>
						Je préfère celui-ci !
					</button>
				</div>
			</div>

			<!-- Track B -->
			<div
				class="flex flex-col items-center justify-between space-y-6 rounded-2xl border border-slate-800 bg-slate-900/50 p-6 text-center shadow-lg transition-colors hover:border-violet-500/50"
			>
				<div class="flex flex-grow flex-col justify-center space-y-2">
					<span class="text-xs font-bold tracking-widest text-slate-500 uppercase">Option B</span>
					<h3 class="text-xl font-bold text-slate-100">{trackB.title}</h3>
					<p class="text-sm text-slate-400">{trackB.artist.name}</p>
				</div>

				<div class="flex w-full flex-col gap-3">
					<button
						onclick={() => playTrack('B', trackB!.preview)}
						class="hover:bg-slate-850 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-800 bg-slate-950 py-2.5 text-sm font-semibold transition-colors hover:text-white"
					>
						{#if playingB}
							<svg class="h-4 w-4 text-violet-400" fill="currentColor" viewBox="0 0 24 24">
								<path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
							</svg>
							Pause extrait
						{:else}
							<svg class="h-4 w-4 text-violet-400" fill="currentColor" viewBox="0 0 24 24">
								<path d="M8 5v14l11-7z" />
							</svg>
							Écouter l'extrait
						{/if}
					</button>

					<button
						onclick={() => vote(trackB!.id, trackA!.id)}
						class="w-full rounded-xl bg-violet-600 py-3 text-sm font-bold text-white shadow-md shadow-violet-900/30 transition-all hover:bg-violet-500"
					>
						Je préfère celui-ci !
					</button>
				</div>
			</div>
		</div>
	{:else if finished}
		<!-- Results -->
		<div class="space-y-6 rounded-2xl border border-slate-800 bg-slate-900/40 p-6 shadow-xl">
			<div class="space-y-2 text-center">
				<h2 class="text-2xl font-bold text-slate-100">Votre classement final</h2>
				<p class="text-sm text-slate-400">Basé sur vos votes comparatifs.</p>
			</div>

			<div
				class="divide-slate-850 divide-y overflow-hidden rounded-xl border border-slate-800/80 bg-slate-950/30"
			>
				{#each finalRanking as track, index (track.id)}
					<div
						class="flex items-center justify-between p-4 transition-colors hover:bg-slate-900/20"
					>
						<div class="flex items-center gap-4">
							<span class="w-6 text-right text-sm font-bold text-violet-400">
								{#if index === 0}🥇{:else if index === 1}🥈{:else if index === 2}🥉{:else}{index +
										1}{/if}
							</span>
							<div class="space-y-0.5">
								<span class="font-semibold text-slate-200">{track.title}</span>
								<span class="block text-xs text-slate-500">{track.artist.name}</span>
							</div>
						</div>
						<span
							class="rounded border border-slate-800 bg-slate-900 px-2 py-0.5 font-mono text-[10px] text-slate-400"
						>
							Score : {scores[track.id]}
						</span>
					</div>
				{/each}
			</div>

			<button
				onclick={restart}
				class="w-full rounded-xl border border-slate-700 bg-slate-800 py-3 font-semibold text-slate-100 transition-colors hover:bg-slate-700"
			>
				Recommencer le tri
			</button>
		</div>
	{/if}
</div>
