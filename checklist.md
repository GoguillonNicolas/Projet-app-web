# Checklist de Développement - Projet App Web B3 (Deezer + Supabase)

Ce document suit l'avancement du projet, découpé de manière logique en fonctionnalités et en commits.

---

## 🛠️ État Actuel du Projet (Clean & Formatté)

- [x] Initialisation de **SvelteKit** + **TypeScript (strict)** + **TailwindCSS v4**.
- [x] Configuration de l'adaptateur Vercel (`@sveltejs/adapter-vercel`).
- [x] Création des types Deezer (`src/lib/types/deezer.ts`).
- [x] Création du service d'appel à l'API Deezer (`src/lib/services/deezer.ts`) avec recherche et détails.
- [x] Formatage global appliqué (Prettier + ESLint OK, aucune erreur).

---

## 📋 Checklist des Tâches par Commit / Feature

### 1. Setup Supabase & Variables d'environnement

- [x] Créer le fichier `.env` local (non versionné) et `.env.example`.
- [x] Initialiser le client Supabase côté serveur (`src/lib/server/supabase.ts`).
- [x] Initialiser le client Supabase côté client (ou partagé dans `src/lib/supabase.ts` avec `@supabase/ssr`).
- _Message de commit suggéré :_ `feat: setup supabase client and environment variables`

### 2. Authentification & Comptes Utilisateurs

- [x] Mettre en place les hooks/layout serveurs pour gérer la session utilisateur (JWT/Cookies).
- [x] Créer la route d'inscription (`/register`) avec formulaire et validation.
- [x] Créer la route de connexion (`/login`) et déconnexion.
- [x] Créer la route profil (`/profile`) avec possibilité de modifier les infos.
- [x] Sécuriser les routes nécessitant une session active.
- _Message de commit suggéré :_ `feat: user authentication and profile management`

### 3. Recherche et Navigation Musique (Deezer)

- [x] Créer la page d'accueil (`/`) avec barre de recherche d'albums/artistes (en temps réel ou validation).
- [x] Gérer l'affichage des résultats (liste principale) avec gestion des états d'UI (Loading, Error, Success).
- [x] Créer la page détail d'un album/artiste au clic (`/album/[id]` et `/artist/[id]`).
- _Message de commit suggéré :_ `feat: music search, list, and detail views using deezer api`

### 4. Gestion des Favoris (Universal Reactivity & Persistance BaaS)

- [x] Implémenter le store global des favoris avec les Runes Svelte 5 (`src/lib/stores/favorites.svelte.ts`).
- [x] Connecter le store à la base de données Supabase pour sauvegarder les favoris de l'utilisateur connecté.
- [x] Ajouter un bouton favoris (Ajout/Retrait) réactif sur les cartes d'albums et la page détail.
- _Message de commit suggéré :_ `feat: favorites management using svelte runes and supabase persistence`

### 5. UI/UX, Filtres, Responsive & Bonus

- [x] Rendre l'interface complètement responsive (Mobile-first avec TailwindCSS v4).
- [x] Ajouter des filtres ou tris côté client sur la liste de recherche/favoris.
- [x] _Bonus_ : Thème clair/sombre persistant.
- [x] _Bonus_ : Améliorations de l'accessibilité (a11y) (HTML5 sémantique).
- _Message de commit suggéré :_ `style: responsive design, client-side filters, and UI polishing`

### 6. CI/CD & Déploiement Vercel

- [x] Configurer le workflow GitHub Actions pour exécuter lint + check sur chaque PR (`.github/workflows/ci.yml`).
- [x] Préparer la configuration et les variables d'environnement pour le déploiement Vercel.
- [x] Rédiger le `README.md` final avec le descriptif et les instructions requis.
- _Message de commit suggéré :_ `ci: add github actions workflow and final readme`
