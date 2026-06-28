import type { PageServerLoad } from './$types';
import { deezerService } from '$lib/server/services/deezer';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params }) => {
	const { id } = params;

	if (!id) {
		throw error(400, "Identifiant de l'album manquant.");
	}

	try {
		const album = await deezerService.getAlbum(id);

		if (!album) {
			throw error(404, 'Album non trouvé.');
		}

		return {
			album
		};
	} catch (err) {
		console.error(`Erreur lors du chargement de l'album ${id}:`, err);
		throw error(500, "Erreur lors de la récupération des détails de l'album.");
	}
};
