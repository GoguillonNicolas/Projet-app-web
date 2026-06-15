import type { DeezerAlbum, DeezerArtist, DeezerSearchResponse } from '$lib/types/deezer';

const BASE_URL = 'https://api.deezer.com';

// Helper pour les appels à l'API Deezer
async function deezerFetch<T>(endpoint: string): Promise<T> {
	const response = await fetch(`${BASE_URL}${endpoint}`);

	if (!response.ok) {
		throw new Error(`Erreur Deezer: ${response.statusText}`);
	}

	const data = await response.json();

	if (data.error) {
		throw new Error(`Erreur API Deezer: ${data.error.message}`);
	}

	return data as T;
}

//Recherche d'artistes ou d'albums
export const deezerService = {
	async searchArtists(query: string): Promise<DeezerSearchResponse<DeezerArtist>> {
		return deezerFetch<DeezerSearchResponse<DeezerArtist>>(
			`/search/artist?q=${encodeURIComponent(query)}`
		);
	},

	async searchAlbums(query: string): Promise<DeezerSearchResponse<DeezerAlbum>> {
		return deezerFetch<DeezerSearchResponse<DeezerAlbum>>(
			`/search/album?q=${encodeURIComponent(query)}`
		);
	},

	async getArtist(id: string | number): Promise<DeezerArtist> {
		return deezerFetch<DeezerArtist>(`/artist/${id}`);
	},

	async getArtistAlbums(id: string | number): Promise<DeezerSearchResponse<DeezerAlbum>> {
		return deezerFetch<DeezerSearchResponse<DeezerAlbum>>(`/artist/${id}/albums`);
	},

	async getAlbum(id: string | number): Promise<DeezerAlbum> {
		return deezerFetch<DeezerAlbum>(`/album/${id}`);
	}
};
