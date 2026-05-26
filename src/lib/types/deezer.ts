export interface DeezerArtist {
	id: number;
	name: string;
	picture_medium: string;
	picture_big: string;
	nb_album?: number;
	tracklist: string;
}

export interface DeezerAlbum {
	id: number;
	title: string;
	cover_medium: string;
	cover_big: string;
	release_date: string;
	artist?: {
		id: number;
		name: string;
	};
	tracks?: {
		data: DeezerTrack[];
	};
}

export interface DeezerTrack {
	id: number;
	title: string;
	duration: number;
	preview: string; // URL de l'extrait 30s
	rank: number;
	artist: {
		id: number;
		name: string;
	};
}

export interface DeezerSearchResponse<T> {
	data: T[];
	total: number;
	next?: string;
}
