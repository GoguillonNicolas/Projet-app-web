# SoundSorter 🎵

**URL de production Vercel** : [https://deezerbox.vercel.app/](https://deezerbox.vercel.app/)

SoundSorter est une application de classement musical interactive. Elle vous permet de rechercher des albums et artistes via l'API Deezer, de sauvegarder vos favoris de manière persistante (via Supabase), et de classer vos titres préférés d'un album en les comparant deux à deux grâce à un algorithme de tri Elo ludique.

Le projet a été développé en utilisant **Svelte 5 (Runes)**, **TypeScript (mode strict)** et **TailwindCSS v4**.

---

## Fonctionnalités

- **Recherche de musique** : Recherche d'albums et d'artistes en temps réel via l'API Deezer (gérée côté serveur pour éviter les soucis de CORS).
- **Fiches détails** : Fiche complète pour les albums (avec liste des pistes et extraits audio de 30 secondes) et pour les artistes (avec discographie).
- **SoundSorter** : Interface de tri comparative pour classer les titres d'un album (système de duels type tournoi Elo) et obtenir votre classement personnalisé.
- **Gestion des favoris** : Ajout et retrait d'albums et artistes en favoris avec synchronisation en temps réel via le store réactif Svelte 5.
- **Filtres et tris client** : Recherche, tri (A-Z, Z-A, récents) et filtrage (tous, albums, artistes) côté client sur la page des favoris.
- **Authentification complète** : Inscription, connexion, déconnexion et modification d'informations de profil via **Supabase Auth & Database**.
- **Thème dynamique** : Bascule de thème clair/sombre persistant (via `localStorage`).
- **Design Premium** : Interface moderne, responsive (mobile-first), dotée de micro-animations et d'effets de flou (backdrop blur).

---

## Stack Technique

- **Frontend** : [SvelteKit](https://kit.svelte.dev/) (v2) + [Svelte 5](https://svelte.dev/) (Runes & Universal Reactivity)
- **Styling** : [TailwindCSS](https://tailwindcss.com/) (v4)
- **Base de données & Auth** : [Supabase](https://supabase.com/) (avec `@supabase/ssr` pour la gestion propre des sessions côté serveur/cookies)
- **Hébergement & Déploiement** : [Vercel](https://vercel.com/)
- **CI/CD** : [GitHub Actions](https://github.com/features/actions) (Linter + svelte-check exécutés à chaque Pull Request)

---

## Schéma de base de données (Supabase)

Pour faire fonctionner la persistance des favoris, exécutez le script SQL suivant dans le **SQL Editor** de votre projet Supabase :

```sql
-- Création de la table des favoris
CREATE TABLE public.favorites (
    id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    item_id text NOT NULL,
    item_type text NOT NULL CHECK (item_type IN ('album', 'artist')),
    title text NOT NULL,
    cover_url text NOT NULL,
    artist_name text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Activation de la sécurité RLS (Row Level Security)
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

-- Politique d'accès pour les utilisateurs connectés (lecture/écriture de leurs propres favoris)
CREATE POLICY "Les utilisateurs authentifiés gèrent leurs propres favoris"
ON public.favorites
FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);
```

---

## Démarrage Local

### 1. Cloner le projet et installer les dépendances

```bash
npm install
```

### 2. Configurer les variables d'environnement

Créez un fichier `.env` à la racine en copiant le fichier d'exemple :

```bash
cp .env.example .env
```

Complétez le fichier `.env` avec les identifiants API Supabase de votre projet :

```env
PUBLIC_SUPABASE_URL="https://votre-projet.supabase.co"
PUBLIC_SUPABASE_ANON_KEY="votre-cle-anon-publique"
```

### 3. Lancer le serveur de développement

```bash
npm run dev
```

L'application est disponible sur [http://localhost:5173](http://localhost:5173).

---

## Structure du Code

```text
src/
├── lib/
│   ├── server/
│   │   ├── services/
│   │   │   └── deezer.ts     # Service de fetch d'API Deezer (serveur uniquement)
│   │   └── supabase.ts       # Initialisation du client Supabase serveur avec cookies
│   ├── stores/
│   │   ├── auth.svelte.ts    # Store réactif d'authentification
│   │   └── favorites.svelte.ts # Store de favoris persistant avec optimistic UI updates
│   ├── types/
│   │   └── deezer.ts         # Types TypeScript pour l'API Deezer
│   └── supabase.ts           # Client Supabase partagé (browser/côté client)
├── routes/
│   ├── +layout.server.ts     # Charge la session Supabase côté serveur
│   ├── +layout.svelte        # Structure globale (Header, Theme Toggle, Footer)
│   ├── +layout.ts            # Synchronise la session Supabase côté client
│   ├── +page.server.ts       # Récupère les albums par défaut ou recherchés
│   ├── +page.svelte          # Page d'accueil avec recherche et grille d'albums
│   ├── album/[id]/           # Fiche détail d'un album avec liste des pistes
│   ├── artist/[id]/          # Fiche détail d'un artiste avec sa discographie
│   ├── favorites/            # Liste des favoris avec filtres et tris côté client
│   ├── login/                # Formulaire de connexion
│   ├── register/             # Formulaire d'inscription
│   ├── logout/               # Endpoint serveur de déconnexion
│   ├── profile/              # Consultation et modification du profil utilisateur
│   └── sorter/[id]/          # SoundSorter : duels de titres musicaux avec previews
├── app.d.ts                  # Déclarations des types globaux (Locals, PageData)
└── hooks.server.ts           # Intercepte et valide la session Supabase via cookies
```

---

## Qualité & Validation

Le projet dispose d'une configuration rigoureuse pour garantir la qualité de code :

- **Linter & Formatter** : ESLint et Prettier configurés. Commande `npm run lint` et `npm run format`.
- **Validation TypeScript** : Lancement de `npm run check` (`svelte-check`) pour valider les types stricts.
