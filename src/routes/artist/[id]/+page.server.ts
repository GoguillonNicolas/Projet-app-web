import type { PageServerLoad } from './$types';
import { deezerService } from '$lib/server/services/deezer';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params }) => {
	const { id } = params;

	if (!id) {
		throw error(400, "Identifiant de l'artiste manquant.");
	}

	try {
		const [artist, albumsResponse] = await Promise.all([
			deezerService.getArtist(id),
			deezerService.getArtistAlbums(id)
		]);

		if (!artist) {
			throw error(404, 'Artiste non trouvé.');
		}

		return {
			artist,
			albums: albumsResponse.data || []
		};
	} catch (err) {
		console.error(`Erreur lors du chargement de l'artiste ${id}:`, err);
		throw error(500, "Erreur lors de la récupération des détails de l'artiste.");
	}
};
