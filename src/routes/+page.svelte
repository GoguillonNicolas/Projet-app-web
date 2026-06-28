<script lang="ts">
	import type { PageData } from './$types';

	let { data } = $props<{ data: PageData }>();

	let searchQuery = $state(data.query || '');

	// Reactivity: update searchQuery if data.query changes from server load
	$effect(() => {
		searchQuery = data.query || '';
	});
</script>

<svelte:head>
	<title>Accueil - Deezerbox</title>
</svelte:head>

<div class="space-y-8">
	<!-- Hero Section -->
	<section class="mx-auto max-w-3xl space-y-4 py-12 text-center">
		<h1
			class="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-indigo-400 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent md:text-5xl"
		>
			Découvrez votre prochaine musique
		</h1>
		<p class="text-lg text-slate-400">
			Recherchez parmi des millions d'albums, consultez les artistes et ajoutez vos coups de cœur à
			vos favoris.
		</p>
	</section>

	<!-- Search Bar -->
	<div class="mx-auto max-w-2xl">
		<form method="GET" class="group relative">
			<div
				class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-500 transition-colors group-focus-within:text-violet-400"
			>
				<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
					/>
				</svg>
			</div>
			<input
				type="text"
				name="q"
				bind:value={searchQuery}
				placeholder="Rechercher un album, un artiste..."
				class="w-full rounded-2xl border border-slate-800 bg-slate-900/60 py-4 pr-28 pl-12 text-slate-100 placeholder-slate-500 shadow-lg backdrop-blur-md transition-all focus:border-violet-500 focus:ring-1 focus:ring-violet-500 focus:outline-none"
			/>
			<button
				type="submit"
				class="absolute top-2 right-2 rounded-xl bg-violet-600 px-6 py-2 text-sm font-semibold text-white shadow-md shadow-violet-900/30 transition-all hover:bg-violet-500"
			>
				Rechercher
			</button>
		</form>
	</div>

	<!-- Results / Trending Section -->
	<div class="space-y-6">
		<div class="flex items-center justify-between border-b border-slate-800 pb-4">
			<h2 class="text-xl font-bold text-slate-100">
				{#if data.query}
					Résultats pour "{data.query}"
				{:else}
					Suggestions d'albums
				{/if}
			</h2>
			<span class="text-sm text-slate-400">
				{data.albums.length} albums trouvés
			</span>
		</div>

		{#if data.error}
			<div class="rounded-2xl border border-red-800 bg-red-950/40 p-4 text-sm text-red-200">
				{data.error}
			</div>
		{:else}
			<div class="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
				{#each data.albums as album (album.id)}
					<div
						class="group flex flex-col overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/40 transition-all duration-300 hover:-translate-y-1 hover:border-slate-700/80 hover:shadow-xl hover:shadow-violet-950/20"
					>
						<!-- Cover Image -->
						<a href="/album/{album.id}" class="relative block aspect-square overflow-hidden">
							<img
								src={album.cover_medium}
								alt="Pochette de {album.title}"
								class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
								loading="lazy"
							/>
							<div
								class="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100"
							>
								<span
									class="rounded-full bg-violet-600/90 px-4 py-2 text-xs font-semibold text-white shadow-lg backdrop-blur-sm"
								>
									Voir l'album
								</span>
							</div>
						</a>
						<!-- Metadata -->
						<div class="flex flex-grow flex-col justify-between space-y-2 p-4">
							<div>
								<a
									href="/album/{album.id}"
									class="line-clamp-1 font-semibold text-slate-100 transition-colors hover:text-violet-400"
								>
									{album.title}
								</a>
								{#if album.artist}
									<a
										href="/artist/{album.artist.id}"
										class="mt-0.5 line-clamp-1 block text-xs text-slate-400 transition-colors hover:text-violet-400"
									>
										{album.artist.name}
									</a>
								{/if}
							</div>

							<div class="text-[10px] font-medium tracking-wider text-slate-500 uppercase">
								Date : {album.release_date || 'N/A'}
							</div>
						</div>
					</div>
				{:else}
					<div class="col-span-full py-16 text-center space-y-2">
						<svg
							class="mx-auto h-12 w-12 text-slate-600"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="1.5"
								d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
							/>
						</svg>
						<p class="text-slate-400 text-lg font-medium">Aucun album trouvé</p>
						<p class="text-slate-500 text-sm">
							Essayez d'autres mots-clés ou vérifiez l'orthographe.
						</p>
					</div>
				{/each}
			</div>
		{/if}
	</div>
</div>
