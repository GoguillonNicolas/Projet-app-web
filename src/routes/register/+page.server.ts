import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions: Actions = {
	default: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();
		const email = formData.get('email') as string;
		const password = formData.get('password') as string;
		const confirmPassword = formData.get('confirmPassword') as string;

		if (!email || !password || !confirmPassword) {
			return fail(400, { message: 'Tous les champs sont obligatoires.', email });
		}

		if (password !== confirmPassword) {
			return fail(400, { message: 'Les mots de passe ne correspondent pas.', email });
		}

		if (password.length < 6) {
			return fail(400, { message: 'Le mot de passe doit faire au moins 6 caractères.', email });
		}

		const { error } = await supabase.auth.signUp({
			email,
			password,
			options: {
				// Redirige l'utilisateur vers l'accueil après vérification si nécessaire
				emailRedirectTo: '/'
			}
		});

		if (error) {
			return fail(400, { message: error.message, email });
		}

		throw redirect(303, '/login?registered=true');
	}
};
