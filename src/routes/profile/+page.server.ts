import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { safeGetSession } }) => {
	const { user } = await safeGetSession();
	return { user };
};

export const actions: Actions = {
	default: async ({ request, locals: { supabase, safeGetSession } }) => {
		const { user } = await safeGetSession();
		if (!user) {
			return fail(401, { message: 'Non autorisé' });
		}

		const formData = await request.formData();
		const email = formData.get('email') as string;

		if (!email) {
			return fail(400, { message: "L'email est obligatoire." });
		}

		const { error } = await supabase.auth.updateUser({ email });

		if (error) {
			return fail(400, { message: error.message });
		}

		return { success: true, message: 'Profil mis à jour avec succès.' };
	}
};
