import { createServerClient } from '@supabase/ssr';
import { type Handle, redirect } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';

const supabaseHandle: Handle = async ({ event, resolve }) => {
	/**
	 * Creates a Supabase client specific to this request.
	 * The client handles reading and writing cookies directly through event.cookies.
	 */
	event.locals.supabase = createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
		cookies: {
			getAll() {
				return event.cookies.getAll();
			},
			setAll(cookiesToSet) {
				cookiesToSet.forEach(({ name, value, options }) => {
					event.cookies.set(name, value, { ...options, path: '/' });
				});
			}
		}
	});

	/**
	 * Helper function to safely retrieve the session and user data.
	 * Using getUser() on the server is recommended over getSession().getUser()
	 * for security reasons as it validates the JWT signature with Supabase.
	 */
	event.locals.safeGetSession = async () => {
		const {
			data: { session }
		} = await event.locals.supabase.auth.getSession();
		if (!session) {
			return { session: null, user: null };
		}

		try {
			const {
				data: { user },
				error
			} = await event.locals.supabase.auth.getUser();
			if (error) {
				// User token is invalid
				return { session: null, user: null };
			}
			return { session, user };
		} catch {
			return { session: null, user: null };
		}
	};

	return resolve(event, {
		filterSerializedResponseHeaders(name) {
			/**
			 * Supabase needs to be able to read some headers
			 */
			return name === 'content-range' || name === 'x-supabase-api-version';
		}
	});
};

const authorizationHandle: Handle = async ({ event, resolve }) => {
	const { session } = await event.locals.safeGetSession();

	// Protéger les routes nécessitant une authentification (ex: /profile, /favorites)
	if (event.url.pathname.startsWith('/profile') && !session) {
		throw redirect(303, '/login');
	}

	// Rediriger les utilisateurs déjà connectés accédant aux pages d'auth
	if ((event.url.pathname === '/login' || event.url.pathname === '/register') && session) {
		throw redirect(303, '/');
	}

	return resolve(event);
};

export const handle = sequence(supabaseHandle, authorizationHandle);
