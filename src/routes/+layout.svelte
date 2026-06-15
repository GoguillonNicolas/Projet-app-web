<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { onMount } from 'svelte';
	import { invalidate } from '$app/navigation';

	let { data, children } = $props();
	let { supabase, session } = $derived(data);

	onMount(() => {
		const {
			data: { subscription }
		} = supabase.auth.onAuthStateChange((event, _session) => {
			if (_session?.expires_at !== session?.expires_at) {
				invalidate('supabase:auth');
			}
		});

		return () => subscription.unsubscribe();
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="flex min-h-screen flex-col bg-slate-950 font-sans text-slate-100">
	<header class="sticky top-0 z-50 border-b border-slate-800 bg-slate-900/50 backdrop-blur-md">
		<div class="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
			<a
				href="/"
				class="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-xl font-bold tracking-tight text-transparent"
			>
				Deezerbox
			</a>
			<nav class="flex items-center gap-6">
				<a href="/" class="text-sm font-medium transition-colors hover:text-violet-400">Accueil</a>
				{#if session}
					<a href="/favorites" class="text-sm font-medium transition-colors hover:text-violet-400"
						>Favoris</a
					>
					<a href="/profile" class="text-sm font-medium transition-colors hover:text-violet-400"
						>Mon Profil</a
					>
					<form action="/logout" method="POST" class="inline">
						<button
							type="submit"
							class="text-sm font-medium text-slate-400 transition-colors hover:text-red-400"
						>
							Déconnexion
						</button>
					</form>
				{:else}
					<a href="/login" class="text-sm font-medium transition-colors hover:text-violet-400"
						>Connexion</a
					>
					<a
						href="/register"
						class="rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-violet-900/30 transition-all hover:bg-violet-500"
					>
						Inscription
					</a>
				{/if}
			</nav>
		</div>
	</header>

	<main class="mx-auto w-full max-w-7xl flex-grow px-4 py-8 sm:px-6 lg:px-8">
		{@render children()}
	</main>

	<footer class="border-t border-slate-900 py-6 text-center text-xs text-slate-500">
		&copy; {new Date().getFullYear()} Deezerbox - Projet Web B3.
	</footer>
</div>
