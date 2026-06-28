<script lang="ts">
	import type { PageData } from './$types';

	let { data } = $props<{ data: PageData }>();
</script>

<svelte:head>
	<title>{data.artist.name} - Deezerbox</title>
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

	<!-- Artist Hero Info -->
	<div
		class="flex flex-col items-center gap-8 border-b border-slate-900 pb-8 md:flex-row md:items-start"
	>
		<div
			class="h-48 w-48 flex-shrink-0 overflow-hidden rounded-full border border-slate-800 bg-slate-900 shadow-2xl md:h-64 md:w-64"
		>
			<img
				src={data.artist.picture_big}
				alt={data.artist.name}
				class="h-full w-full object-cover"
			/>
		</div>

		<div class="flex-grow space-y-4 text-center md:text-left">
			<span
				class="rounded-full border border-violet-800 bg-violet-900/50 px-3 py-1 text-xs font-bold tracking-wider text-violet-300 uppercase"
			>
				Artiste
			</span>
			<h1 class="text-3xl font-extrabold tracking-tight text-slate-100 md:text-5xl">
				{data.artist.name}
			</h1>

			<div
				class="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-slate-400 md:justify-start"
			>
				{#if data.artist.nb_album !== undefined}
					<span>{data.artist.nb_album} albums référencés</span>
				{/if}
			</div>
		</div>
	</div>

	<!-- Artist's Albums List -->
	<div class="space-y-6">
		<h2 class="text-xl font-bold text-slate-100">Discographie / Albums</h2>

		{#if data.albums.length > 0}
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
									class="line-clamp-2 font-semibold text-slate-100 transition-colors hover:text-violet-400"
								>
									{album.title}
								</a>
							</div>

							<div class="text-[10px] font-medium tracking-wider text-slate-500 uppercase">
								Date : {album.release_date || 'N/A'}
							</div>
						</div>
					</div>
				{/each}
			</div>
		{:else}
			<div class="p-8 text-center text-slate-500">Aucun album trouvé pour cet artiste.</div>
		{/if}
	</div>
</div>
