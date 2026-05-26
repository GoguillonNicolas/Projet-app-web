import { createServerClient } from '@supabase/ssr';
import type { RequestEvent } from '@sveltejs/kit';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';

export function createSupabaseServerClient(event: RequestEvent) {
	return createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
		cookies: {
			getAll() {
				return event.cookies.getAll();
			},
			setAll(cookiesToSet) {
				/**
				 * Note: SvelteKit handles cookies via cookies.set()
				 * but with @supabase/ssr setAll is used to synchronise cookies.
				 */
				try {
					cookiesToSet.forEach(({ name, value, options }) => {
						event.cookies.set(name, value, { ...options, path: '/' });
					});
				} catch {
					// The `setAll` method was called from a Server Component.
					// This can be ignored if you have middleware refreshing
					// token sessions.
				}
			}
		}
	});
}
