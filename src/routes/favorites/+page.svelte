<script lang="ts">
	import { favoritesStore } from '$lib/stores/favorites.svelte';
	import { page } from '$app/state';

	const session = $derived(page.data.session);

	let filterType = $state<'all' | 'album' | 'artist'>('all');
	let sortBy = $state<'recent' | 'az' | 'za'>('recent');

	const filteredItems = $derived(
		favoritesStore.items.filter((item) => filterType === 'all' || item.item_type === filterType)
	);

	const displayedItems = $derived(
		[...filteredItems].sort((a, b) => {
			if (sortBy === 'az') return a.title.localeCompare(b.title);
			if (sortBy === 'za') return b.title.localeCompare(a.title);
			return 0; // plus récents
		})
	);

	async function handleRemove(itemId: string | number) {
		if (session?.user?.id) {
			await favoritesStore.remove(session.user.id, itemId);
		}
	}
</script>

<svelte:head>
	<title>Mes Favoris - Deezerbox</title>
</svelte:head>

<div class="space-y-6">
	<div class="flex items-center justify-between border-b border-slate-800 pb-4">
		<h1 class="text-3xl font-extrabold tracking-tight text-slate-100">Mes Favoris</h1>
		<span class="text-sm text-slate-400">
			{favoritesStore.items.length} éléments sauvegardés
		</span>
	</div>

	{#if favoritesStore.loading}
		<div class="flex items-center justify-center py-20">
			<svg class="h-8 w-8 animate-spin text-violet-500" fill="none" viewBox="0 0 24 24">
				<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"
				></circle>
				<path
					class="opacity-75"
					fill="currentColor"
					d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
				></path>
			</svg>
		</div>
	{:else if favoritesStore.items.length > 0}
		<!-- Controls -->
		<div
			class="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-800/65 bg-slate-900/30 p-4"
		>
			<div class="flex items-center gap-3">
				<span class="text-xs font-bold tracking-wider text-slate-400 uppercase">Filtrer par :</span>
				<div class="flex gap-2">
					<button
						onclick={() => (filterType = 'all')}
						class="rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors {filterType ===
						'all'
							? 'bg-violet-600 text-white'
							: 'bg-slate-950 text-slate-400 hover:text-slate-200'}"
					>
						Tous
					</button>
					<button
						onclick={() => (filterType = 'album')}
						class="rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors {filterType ===
						'album'
							? 'bg-violet-600 text-white'
							: 'bg-slate-950 text-slate-400 hover:text-slate-200'}"
					>
						Albums
					</button>
					<button
						onclick={() => (filterType = 'artist')}
						class="rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors {filterType ===
						'artist'
							? 'bg-violet-600 text-white'
							: 'bg-slate-950 text-slate-400 hover:text-slate-200'}"
					>
						Artistes
					</button>
				</div>
			</div>

			<div class="flex items-center gap-2">
				<label for="sort-select" class="text-xs font-bold tracking-wider text-slate-400 uppercase"
					>Trier par :</label
				>
				<select
					id="sort-select"
					bind:value={sortBy}
					class="cursor-pointer rounded-xl border border-slate-800 bg-slate-950 px-3 py-1.5 text-xs text-slate-200 transition-colors focus:border-violet-500 focus:outline-none"
				>
					<option value="recent">Plus récents</option>
					<option value="az">Nom (A-Z)</option>
					<option value="za">Nom (Z-A)</option>
				</select>
			</div>
		</div>

		{#if displayedItems.length > 0}
			<div class="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
				{#each displayedItems as item (item.item_id)}
					<div
						class="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/40 transition-all duration-300 hover:-translate-y-1 hover:border-slate-700/80 hover:shadow-xl hover:shadow-violet-950/20"
					>
						<!-- Remove Button overlay -->
						<button
							onclick={() => handleRemove(item.item_id)}
							class="absolute top-3 right-3 z-10 rounded-xl bg-slate-950/70 p-2 text-slate-300 opacity-0 shadow-md backdrop-blur-sm transition-all group-hover:opacity-100 hover:bg-rose-600/90 hover:text-white"
							title="Retirer des favoris"
						>
							<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
								/>
							</svg>
						</button>

						<!-- Item Link -->
						<a
							href="/{item.item_type}/{item.item_id}"
							class="relative block aspect-square overflow-hidden"
						>
							<img
								src={item.cover_url}
								alt="Pochette de {item.title}"
								class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
								loading="lazy"
							/>
							<div
								class="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100"
							>
								<span
									class="rounded-full bg-violet-600/90 px-4 py-2 text-xs font-semibold text-white shadow-lg backdrop-blur-sm"
								>
									Consulter
								</span>
							</div>
						</a>

						<!-- Metadata -->
						<div class="flex flex-grow flex-col justify-between space-y-2 p-4">
							<div>
								<a
									href="/{item.item_type}/{item.item_id}"
									class="line-clamp-1 font-semibold text-slate-100 transition-colors hover:text-violet-400"
								>
									{item.title}
								</a>
								{#if item.artist_name}
									<span class="mt-0.5 line-clamp-1 block text-xs text-slate-400">
										{item.artist_name}
									</span>
								{/if}
							</div>

							<div
								class="flex items-center justify-between text-[10px] font-semibold tracking-wider text-slate-500 uppercase"
							>
								<span
									class="rounded border border-slate-800 bg-slate-950 px-2 py-0.5 text-slate-400"
									>{item.item_type}</span
								>
							</div>
						</div>
					</div>
				{/each}
			</div>
		{:else}
			<div class="py-16 text-center text-slate-500">
				Aucun favori ne correspond à ces critères de filtre.
			</div>
		{/if}
	{:else}
		<div class="space-y-3 py-20 text-center">
			<svg
				class="mx-auto h-16 w-16 text-slate-700"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="1.5"
					d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
				/>
			</svg>
			<p class="text-lg font-medium text-slate-400">Votre liste de favoris est vide</p>
			<p class="mx-auto max-w-xs text-sm text-slate-500">
				Parcourez la page d'accueil et ajoutez des albums pour les retrouver ici.
			</p>
			<div class="pt-4">
				<a
					href="/"
					class="rounded-xl bg-violet-600 px-6 py-3 font-semibold text-white shadow-md shadow-violet-900/30 transition-all hover:bg-violet-500"
				>
					Retourner à l'accueil
				</a>
			</div>
		</div>
	{/if}
</div>
