import type { LayoutLoad } from './$types';
import { supabase } from '$lib/supabase';

export const load: LayoutLoad = async ({ data, depends }) => {
	// Permet d'invalider et recharger la session via invalidate('supabase:auth')
	depends('supabase:auth');

	return {
		supabase,
		session: data.session,
		user: data.user
	};
};
