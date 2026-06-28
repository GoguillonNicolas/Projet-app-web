<script lang="ts">
	import type { PageData } from './$types';
	import { page } from '$app/state';
	import { favoritesStore } from '$lib/stores/favorites.svelte';

	let { data } = $props<{ data: PageData }>();

	const session = $derived(page.data.session);
	const isFav = $derived(favoritesStore.isFavorite(data.album.id));

	async function handleFavorite() {
		if (!session?.user?.id) return;
		if (isFav) {
			await favoritesStore.remove(session.user.id, data.album.id);
		} else {
			await favoritesStore.add(session.user.id, {
				id: data.album.id,
				type: 'album',
				title: data.album.title,
				cover_url: data.album.cover_medium,
				artist_name: data.album.artist?.name
			});
		}
	}

	let currentTrackId = $state<number | null>(null);
	let audioEl = $state<HTMLAudioElement | null>(null);
	let isPlaying = $state(false);

	function togglePlay(trackId: number, previewUrl: string) {
		if (currentTrackId === trackId) {
			if (isPlaying) {
				audioEl?.pause();
				isPlaying = false;
			} else {
				audioEl?.play();
				isPlaying = true;
			}
		} else {
			if (audioEl) {
				audioEl.pause();
			}
			currentTrackId = trackId;
			audioEl = new Audio(previewUrl);
			audioEl.play();
			isPlaying = true;

			audioEl.onended = () => {
				isPlaying = false;
				currentTrackId = null;
			};
		}
	}

	function formatDuration(seconds: number): string {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins}:${secs.toString().padStart(2, '0')}`;
	}
</script>

<svelte:head>
	<title>{data.album.title} - Deezerbox</title>
</svelte:head>

<div class="space-y-8">
	<!-- Go Back -->
	<a
		href="/"
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
		Retour aux recherches
	</a>

	<!-- Album Hero Info -->
	<div class="flex flex-col items-center gap-8 md:flex-row md:items-start">
		<div
			class="h-64 w-64 flex-shrink-0 overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 shadow-2xl md:h-80 md:w-80"
		>
			<img
				src={data.album.cover_big}
				alt="Pochette de {data.album.title}"
				class="h-full w-full object-cover"
			/>
		</div>

		<div class="flex-grow space-y-4 text-center md:text-left">
			<span
				class="rounded-full border border-violet-800 bg-violet-900/50 px-3 py-1 text-xs font-bold tracking-wider text-violet-300 uppercase"
			>
				Album
			</span>
			<h1 class="text-3xl font-extrabold tracking-tight text-slate-100 md:text-5xl">
				{data.album.title}
			</h1>

			{#if data.album.artist}
				<div class="flex items-center justify-center gap-3 md:justify-start">
					<a
						href="/artist/{data.album.artist.id}"
						class="text-lg font-semibold text-violet-400 hover:underline"
					>
						{data.album.artist.name}
					</a>
				</div>
			{/if}

			<div
				class="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-slate-400 md:justify-start"
			>
				<span>Sortie : {data.album.release_date || 'Inconnue'}</span>
				{#if data.album.tracks?.data}
					<span class="h-1 w-1 rounded-full bg-slate-700"></span>
					<span>{data.album.tracks.data.length} titres</span>
				{/if}
			</div>

			<!-- Favorites & Sorter Actions -->
			<div class="flex flex-wrap justify-center gap-4 pt-4 md:justify-start">
				{#if session}
					<button
						onclick={handleFavorite}
						class="flex items-center gap-2 rounded-xl border px-6 py-3 text-sm font-semibold transition-all hover:-translate-y-0.5 active:translate-y-0 {isFav
							? 'border-rose-500/35 bg-rose-600/10 text-rose-400 hover:bg-rose-600/20'
							: 'hover:bg-slate-850 border-slate-800 bg-slate-900 text-slate-300 hover:border-slate-700'}"
					>
						<svg
							class="h-5 w-5 {isFav ? 'fill-current' : 'fill-none'}"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
							/>
						</svg>
						{isFav ? 'Retirer des favoris' : 'Ajouter aux favoris'}
					</button>
				{:else}
					<a
						href="/login"
						class="hover:bg-slate-850 inline-flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/60 px-6 py-3 text-sm font-semibold text-slate-400 transition-all hover:text-slate-300"
					>
						<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
							/>
						</svg>
						Se connecter pour ajouter aux favoris
					</a>
				{/if}

				<a
					href="/sorter/{data.album.id}"
					class="border-violet-850 inline-flex items-center gap-2 rounded-xl border bg-violet-600 px-6 py-3 text-sm font-semibold text-white shadow-md shadow-violet-900/30 transition-all hover:-translate-y-0.5 hover:bg-violet-500 active:translate-y-0"
				>
					<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"
						/>
					</svg>
					Trier et Classer les titres
				</a>
			</div>
		</div>
	</div>

	<!-- Tracklist Section -->
	<div class="space-y-4">
		<h2 class="text-xl font-bold text-slate-100">Liste des titres</h2>

		<div
			class="divide-slate-850 divide-y overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/30"
		>
			{#if data.album.tracks?.data && data.album.tracks.data.length > 0}
				{#each data.album.tracks.data as track, index (track.id)}
					<div
						class="group flex items-center justify-between p-4 transition-colors hover:bg-slate-900/60"
					>
						<div class="flex items-center gap-4">
							<span class="w-6 text-right text-sm font-semibold text-slate-500">{index + 1}</span>

							<!-- Inline Play/Pause Button -->
							<button
								type="button"
								onclick={() => togglePlay(track.id, track.preview)}
								class="rounded-xl bg-violet-600/10 p-2 text-violet-400 transition-all hover:bg-violet-600 hover:text-white"
							>
								{#if currentTrackId === track.id && isPlaying}
									<svg class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
										<path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
									</svg>
								{:else}
									<svg class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
										<path d="M8 5v14l11-7z" />
									</svg>
								{/if}
							</button>

							<div class="space-y-0.5">
								<span
									class="block font-medium text-slate-200 transition-colors group-hover:text-white"
								>
									{track.title}
								</span>
								<span class="block text-xs text-slate-500">
									{track.artist.name}
								</span>
							</div>
						</div>

						<div class="flex items-center gap-6">
							<span class="font-mono text-sm text-slate-400">
								{formatDuration(track.duration)}
							</span>
						</div>
					</div>
				{/each}
			{:else}
				<div class="p-8 text-center text-slate-500">Aucun titre disponible pour cet album.</div>
			{/if}
		</div>
	</div>
</div>
