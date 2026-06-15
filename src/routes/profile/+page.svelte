<script lang="ts">
	import type { ActionData, PageData } from './$types';

	let { data, form } = $props<{ data: PageData; form: ActionData }>();
	let email = $state(data.user?.email ?? '');
	let loading = $state(false);

	function handleSubmit() {
		loading = true;
	}
</script>

<svelte:head>
	<title>Mon Profil - Deezerbox</title>
</svelte:head>

<div class="mx-auto my-12 max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-xl">
	<h1
		class="mb-2 bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-2xl font-bold text-transparent"
	>
		Mon Profil
	</h1>
	<p class="mb-6 text-sm text-slate-400">Gérez les informations de votre compte utilisateur.</p>

	{#if form?.message}
		<div
			class="mb-4 rounded-lg border p-3 text-sm {form.success
				? 'border-emerald-800 bg-emerald-950/50 text-emerald-200'
				: 'border-red-800 bg-red-950/50 text-red-200'}"
		>
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
				Mise à jour...
			{:else}
				Mettre à jour le profil
			{/if}
		</button>
	</form>
</div>
