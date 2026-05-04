# Projet App Web - B3

**Projet Individuel — SvelteKit Application**

## Présentation du projet
Dans le cadre du module Application Web, tu vas concevoir et déployer une application web front-end complète en utilisant SvelteKit, TypeScript et TailwindCSS. Ce projet est individuel et représente la partie pratique de ton évaluation finale.

L'objectif est de te confronter aux conditions réelles du développement front-end professionnel : choix d'architecture, consommation d'une API tierce, gestion de l'authentification, déploiement continu et qualité de code.

## Fiche projet

| Caractéristique | Détail |
| :--- | :--- |
| **Module** | Application Web — B3 Développeur Web |
| **Format** | Projet individuel |
| **Stack imposée** | SvelteKit + TypeScript strict + TailwindCSS v4 |
| **API** | Libre — soumise à validation par l'intervenant |
| **Rendu** | GitHub (branches + PR) + CI GitHub Actions + Vercel |
| **Soutenance** | 29 juin 2026 |
| **Format soutenance** | 5 min démo + 15 min échange technique |

## Stack de données
Ton application repose sur **deux couches distinctes** que tu dois mettre en place :

### 1. Backend as a Service (BaaS) — obligatoire
Pour tout ce qui concerne les **comptes utilisateurs, l'authentification et la persistance des données** (favoris, profil, préférences), tu utiliseras un BaaS au choix :
- Supabase
- Appwrite
- Firebase

### 2. API de contenu — selon ton projet
Pour les **données affichées dans l'application** (films, musique, livres...), deux cas de figure :

*   **Cas A — tu utilises une API de contenu tierce :**
    *   TMDB (The Movie Database) — films et séries
    *   Spotify API — musique et playlists
    *   OpenLibrary — livres
    *   Toute API publique avec suffisamment de données (*à valider*)
*   **Cas B — ton contenu vient directement de ton BaaS :**
    *   Si tu construis ta propre base de données de contenu sur Supabase / Appwrite (ex : projet issu de ton module API S1 migré en ligne), pas besoin d'API tierce. Ton BaaS fait tout.

> [!IMPORTANT]
> Tu dois soumettre ton choix de stack (BaaS + API de contenu si applicable) à l'intervenant avant le **17 avril 2026** pour validation. Aucun projet ne sera évalué sur une stack non validée.

---

## Fonctionnalités attendues
Les fonctionnalités obligatoires sont le socle minimal évalué. Les bonus ne compensent pas un socle incomplet.

### Authentification & Compte
| Fonctionnalité | Détail | Statut |
| :--- | :--- | :--- |
| Inscription | Formulaire avec validation des champs | ✅ Obligatoire |
| Connexion / Déconnexion | Gestion du token JWT, session persistante | ✅ Obligatoire |
| Profil utilisateur | Affichage et modification des infos du compte | ✅ Obligatoire |

### Fonctionnalités métier
| Fonctionnalité | Détail | Statut |
| :--- | :--- | :--- |
| Liste principale | Affichage des données de l'API avec pagination ou infinite scroll | ✅ Obligatoire |
| Page détail | Vue complète d'un élément au clic | ✅ Obligatoire |
| Recherche | Recherche en temps réel ou avec validation | ✅ Obligatoire |
| Favoris | Ajout/retrait, persistance via état partagé (Universal Reactivity) | ✅ Obligatoire |
| Filtres / Tri | Au moins un critère de filtre ou de tri côté client | ✅ Obligatoire |
| Gestion états UI | Loading, error et success sur chaque appel API | ✅ Obligatoire |

### Qualité technique
| Fonctionnalité | Détail | Statut |
| :--- | :--- | :--- |
| Responsive design | Mobile-first avec TailwindCSS v4 | ✅ Obligatoire |
| TypeScript strict | Typage complet, interfaces pour les données API | ✅ Obligatoire |
| Server Actions | Au moins un formulaire géré via `+page.server.ts` | ✅ Obligatoire |
| CI GitHub Actions | Workflow lint + build sur chaque PR | ✅ Obligatoire |
| Déploiement Vercel | Application accessible via une URL publique | ✅ Obligatoire |
| Tests Vitest | Tests unitaires, intégration, end-to-end | 📦 Bonus |
| Accessibilité a11y | Navigation clavier, aria-labels, contrastes corrects | 📦 Bonus |
| Thème clair/sombre | Toggle persistant via état global | 📦 Bonus |

---

## Contraintes techniques obligatoires
Ces contraintes ne sont pas négociables. Un projet qui ne les respecte pas sera pénalisé indépendamment de la qualité du résultat final.
- SvelteKit avec routing file-based (`+page.svelte`, `+page.server.ts`, `+layout.svelte`)
- TypeScript en mode strict — pas de `any`, typage explicite des données API
- TailwindCSS v4 — pas de CSS custom sauf cas justifié
- Universal Reactivity — état partagé entre composants via fichiers `.svelte.ts`
- GitHub avec branches de feature et Pull Requests vers `main`
- GitHub Actions — pipeline CI fonctionnel (lint + build)
- Déploiement Vercel — URL publique fournie avec le rendu

---

## Modalités de rendu
### Ce que tu dois remettre
- Lien vers le **repository GitHub public** (branches + historique de PR visible)
- **URL Vercel** de l'application déployée et fonctionnelle
- **README complet** (voir ci-dessous)

### Contenu du README (obligatoire)
- Description du projet et de l'API choisie
- Instructions pour lancer le projet en local
- Structure des fichiers expliquée
- Fonctionnalités implémentées vs fonctionnalités manquantes (*sois honnête*)
- Captures d'écran de l'application
- Difficultés rencontrées et solutions apportées

---

## Date limite de rendu
Le rendu doit être effectué avant la soutenance du **29 juin 2026**. Aucun commit poussé après le début des soutenances ne sera pris en compte.

---

## Soutenance
La soutenance dure **20 minutes** et se déroule en deux temps :

| Durée | Phase | Contenu attendu |
| :--- | :--- | :--- |
| **5 min** | Présentation du rendu | Démo de l'application, ce qui fonctionne, ce qui ne fonctionne pas, tes propositions d'amélioration |
| **15 min** | Échange technique | Questions sur le code produit — toute portion du code peut être abordée |

---

## Ressources
- 📖 **Documentation SvelteKit :** [kit.svelte.dev](https://kit.svelte.dev)
- ⚡ **Svelte 5 Runes :** [svelte.dev/docs/svelte/overview](https://svelte.dev/docs/svelte/overview)
- 🎨 **TailwindCSS v4 :** [tailwindcss.com](https://tailwindcss.com)
- 🔷 **TypeScript :** [typescriptlang.org/docs](https://typescriptlang.org/docs)
- ⚙️ **GitHub Actions :** [docs.github.com/actions](https://docs.github.com/actions)
- 🚀 **Vercel + SvelteKit :** [vercel.com/docs/frameworks/sveltekit](https://vercel.com/docs/frameworks/sveltekit)
- 🎓 **Cours en ligne du module Dev Front avec TypeScript :** [dub.sh/mds-b2](https://dub.sh/mds-b2)
- 🎓 **Cours en ligne du module TailwindCSS :** [dub.sh/mds-b3-webdesign](https://dub.sh/mds-b3-webdesign)
