import { supabase } from '$lib/supabase';

export interface FavoriteItem {
	id?: number;
	user_id: string;
	item_id: string;
	item_type: 'album' | 'artist';
	title: string;
	cover_url: string;
	artist_name?: string;
	created_at?: string;
}

class FavoritesStore {
	#items = $state<FavoriteItem[]>([]);
	#loading = $state(false);

	get items() {
		return this.#items;
	}

	get loading() {
		return this.#loading;
	}

	// Charger les favoris depuis Supabase
	async load(userId: string) {
		this.#loading = true;
		try {
			const { data, error } = await supabase
				.from('favorites')
				.select('*')
				.eq('user_id', userId)
				.order('created_at', { ascending: false });

			if (error) throw error;
			this.#items = data || [];
		} catch (err) {
			console.error('Erreur lors du chargement des favoris:', err);
		} finally {
			this.#loading = false;
		}
	}

	// Ajouter un favori
	async add(
		userId: string,
		item: {
			id: string | number;
			type: 'album' | 'artist';
			title: string;
			cover_url: string;
			artist_name?: string;
		}
	) {
		const newFav: FavoriteItem = {
			user_id: userId,
			item_id: String(item.id),
			item_type: item.type,
			title: item.title,
			cover_url: item.cover_url,
			artist_name: item.artist_name
		};

		try {
			// Optimistic UI update
			const tempId = Math.random();
			this.#items = [{ ...newFav, id: tempId }, ...this.#items];

			const { data, error } = await supabase.from('favorites').insert([newFav]).select();

			if (error) {
				// Rollback on error
				this.#items = this.#items.filter((i) => i.id !== tempId);
				throw error;
			}

			if (data && data[0]) {
				// Remplacer l'élément temporaire par le vrai enregistré en DB
				this.#items = this.#items.map((i) => (i.id === tempId ? data[0] : i));
			}
		} catch (err) {
			console.error("Erreur lors de l'ajout du favori:", err);
		}
	}

	// Retirer un favori
	async remove(userId: string, itemId: string | number) {
		const stringId = String(itemId);
		const previousItems = [...this.#items];

		try {
			// Optimistic UI update
			this.#items = this.#items.filter((i) => i.item_id !== stringId);

			const { error } = await supabase
				.from('favorites')
				.delete()
				.eq('user_id', userId)
				.eq('item_id', stringId);

			if (error) {
				// Rollback
				this.#items = previousItems;
				throw error;
			}
		} catch (err) {
			console.error('Erreur lors du retrait du favori:', err);
		}
	}

	// Vérifier si un élément est favori
	isFavorite(itemId: string | number): boolean {
		const stringId = String(itemId);
		return this.#items.some((i) => i.item_id === stringId);
	}

	// Vider le store (déconnexion)
	clear() {
		this.#items = [];
	}
}

export const favoritesStore = new FavoritesStore();
