# SoundSorter

Application de classement musical. Tu choisis un album, l'app te fait comparer deux sons à la fois jusqu'à obtenir un classement final de tes titres préférés.

## Stack

- SvelteKit + TypeScript strict
- TailwindCSS v4
- Supabase (auth, favoris, résultats)
- API Deezer (previews 30s, appels côté serveur uniquement à cause du CORS)
- Déploiement Vercel + CI GitHub Actions

## Lancer en local

```bash
npm install
cp .env.example .env  # remplir les variables
npm run dev
```

## Variables d'environnement

```
SUPABASE_URL=
SUPABASE_ANON_KEY=
```

## Structure

```
src/
├── lib/
│   ├── server/        # deezer.ts, supabase.ts (server-side uniquement)
│   ├── stores/        # auth.svelte.ts, favorites.svelte.ts
│   └── types/         # deezer.ts, supabase.ts
└── routes/
    ├── api/deezer/    # proxy Deezer (search, artist, album)
    ├── artist/[id]/
    ├── album/[id]/
    ├── sorter/
    ├── favorites/
    └── profile/
```

## Fonctionnalités

- Recherche artistes / albums
- Page détail artiste et album
- Sorter avec preview audio
- Favoris persistés
- Authentification (Supabase)
- Profil utilisateur

## Difficultés rencontrées

_À compléter_
