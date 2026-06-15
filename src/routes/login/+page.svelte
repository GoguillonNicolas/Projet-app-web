<script lang="ts">
	import type { ActionData } from './$types';
	import { page } from '$app/state';

	let { form } = $props<{ form: ActionData }>();
	let email = $state(form?.email ?? '');
	let password = $state('');
	let loading = $state(false);

	const registered = $derived(page.url.searchParams.get('registered') === 'true');

	function handleSubmit() {
		loading = true;
	}
</script>

<svelte:head>
	<title>Connexion - Deezerbox</title>
</svelte:head>

<div class="mx-auto my-12 max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-xl">
	<h1
		class="mb-2 bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-2xl font-bold text-transparent"
	>
		Se connecter
	</h1>
	<p class="mb-6 text-sm text-slate-400">Accédez à votre espace et à vos favoris.</p>

	{#if registered}
		<div
			class="mb-4 rounded-lg border border-emerald-800 bg-emerald-950/50 p-3 text-sm text-emerald-200"
		>
			Inscription réussie ! Vous pouvez maintenant vous connecter.
		</div>
	{/if}

	{#if form?.message}
		<div class="mb-4 rounded-lg border border-red-800 bg-red-950/50 p-3 text-sm text-red-200">
			{form.message}
		</div>
	{/if}

	<form method="POST" onsubmit={handleSubmit} class="space-y-4">
		<div>
			<label
				for="email"
				class="mb-2 block text-xs font-semibold tracking-wider text-slate-400 uppercase"
			>
				Adresse Email
			</label>
			<input
				id="email"
				name="email"
				type="email"
				required
				bind:value={email}
				class="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-slate-100 placeholder-slate-600 transition-colors focus:border-violet-500 focus:outline-none"
				placeholder="votre@email.com"
			/>
		</div>

		<div>
			<div class="mb-2 flex items-center justify-between">
				<label
					for="password"
					class="block text-xs font-semibold tracking-wider text-slate-400 uppercase"
				>
					Mot de passe
				</label>
			</div>
			<input
				id="password"
				name="password"
				type="password"
				required
				bind:value={password}
				class="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-slate-100 placeholder-slate-600 transition-colors focus:border-violet-500 focus:outline-none"
				placeholder="••••••••"
			/>
		</div>

		<button
			type="submit"
			disabled={loading}
			class="flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 py-3 font-semibold text-white shadow-md shadow-violet-900/30 transition-all hover:bg-violet-500 disabled:bg-violet-800"
		>
			{#if loading}
				<svg class="h-5 w-5 animate-spin text-white" fill="none" viewBox="0 0 24 24">
					<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"
					></circle>
					<path
						class="opacity-75"
						fill="currentColor"
						d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
					></path>
				</svg>
				Connexion en cours...
			{:else}
				Se connecter
			{/if}
		</button>
	</form>

	<div class="mt-6 border-t border-slate-800 pt-6 text-center text-sm">
		<span class="text-slate-400">Pas encore de compte ?</span>
		<a href="/register" class="ml-1 font-medium text-violet-400 hover:underline">S'inscrire</a>
	</div>
</div>
