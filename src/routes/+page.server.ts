import type { PageServerLoad } from './$types';
import { deezerService } from '$lib/server/services/deezer';

export const load: PageServerLoad = async ({ url }) => {
	const query = url.searchParams.get('q') || '';

	try {
		// Si aucune recherche n'est spécifiée, on affiche une sélection par défaut
		const searchTerm = query.trim() || 'Daft Punk';
		const searchResults = await deezerService.searchAlbums(searchTerm);

		return {
			albums: searchResults.data || [],
			query
		};
	} catch (error) {
		console.error('Erreur lors du chargement des albums Deezer:', error);
		return {
			albums: [],
			query,
			error: 'Impossible de charger les albums pour le moment.'
		};
	}
};
