<div align="center">

<br />

# 🌉 SkillBridge

### *Le pont entre les compétences et les opportunités en Afrique*

**L'écosystème reliant les talents, les compétences, l'expérience et les opportunités à travers le continent africain.**

<br />

[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.1-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-2.49-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.io/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.0-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

<br />

</div>

---

## 📖 À propos

**SkillBridge** est une plateforme web full-stack pensée pour l'Afrique, conçue pour connecter :

- 👤 **Les talents** — jeunes professionnels cherchant à valoriser leurs compétences
- 🧑‍🏫 **Les mentors** — experts souhaitant transmettre leur savoir-faire
- 🏢 **Les entreprises** — recruteurs et institutions à la recherche de profils qualifiés
- 🎓 **Les apprenants** — personnes désireuses de se former et de progresser

La plateforme propose un passeport numérique de compétences, un système de certification vérifiable, des formations en ligne, un studio mentor, et bien plus encore.

---

## ✨ Fonctionnalités principales

| Fonctionnalité | Description |
|---|---|
| 🔐 **Authentification** | Inscription / connexion sécurisée via Supabase Auth |
| 🧭 **Onboarding intelligent** | Parcours guidé selon le type de compte (talent, mentor, entreprise…) |
| 📊 **Dashboard personnel** | Espace de gestion du profil, compétences et activités |
| 🎓 **Formations en ligne** | Catalogue de cours, lecteur de leçons intégré, suivi de progression |
| 🧑‍🏫 **Mentor Studio** | Espace de création et de gestion de contenu pour les mentors |
| 🌐 **Explorateur de talents** | Moteur de découverte de profils publics |
| 🤝 **Échange de compétences** | Système de mise en relation pour le partage de savoir |
| 📜 **Passeport de compétences** | Passeport numérique officiel générant un QR code vérifiable |
| ✅ **Vérification de certificats** | Système de vérification publique des certifications délivrées |
| 💼 **Opportunités** | Offres d'emploi et de missions pour les talents |
| 📬 **Messagerie** | Interface de messagerie entre utilisateurs |
| ❤️ **Favoris** | Sauvegarde de profils et de contenus |
| 🛡️ **Administration** | Dashboard admin sécurisé pour la gestion de la plateforme |
| 📱 **Profil public** | Page de profil publique et passeport partageable |

---

## 🛠️ Stack technique

```
Frontend
├── React 18.3          — Bibliothèque UI avec hooks modernes
├── TypeScript 5.7      — Typage statique strict
├── Vite 6.1            — Build tool ultra-rapide
├── TailwindCSS 4.0     — Framework CSS utilitaire
├── Motion 13           — Animations fluides
├── Lucide React        — Icônes modernes et légères
├── Font Awesome        — Icônes complémentaires
└── React QR Code       — Génération de QR codes

Backend (BaaS)
├── Supabase            — Base de données PostgreSQL, Auth, Storage
├── Row Level Security  — Sécurité fine au niveau des lignes
└── Supabase Storage    — Stockage des avatars utilisateurs
```

---

## 🗂️ Structure du projet

```
skillbridge/
├── src/
│   ├── components/         # Composants réutilisables (UI)
│   │   ├── AppShell.tsx        # Shell principal (sidebar + layout connecté)
│   │   ├── AppSidebar.tsx      # Barre latérale de navigation
│   │   ├── Navbar.tsx          # Barre de navigation publique
│   │   ├── Footer.tsx          # Pied de page public
│   │   ├── OfficialSkillPassport.tsx  # Passeport de compétences officiel
│   │   ├── SkillPassport.tsx   # Composant passeport
│   │   ├── ProfileModal.tsx    # Modal d'édition de profil
│   │   ├── ProfileEditor.tsx   # Éditeur de profil complet
│   │   ├── CertificateModal.tsx # Modal de certificat
│   │   ├── AvatarUploader.tsx  # Upload d'avatar
│   │   └── ...                 # Autres composants
│   │
│   ├── views/              # Pages / vues de l'application
│   │   ├── HomeView.tsx        # Page d'accueil publique
│   │   ├── AuthView.tsx        # Connexion & Inscription
│   │   ├── OnboardingView.tsx  # Parcours d'onboarding
│   │   ├── DashboardTalentView.tsx  # Dashboard utilisateur
│   │   ├── LearnView.tsx       # Catalogue de formations
│   │   ├── LearnDetailView.tsx # Détail d'une formation
│   │   ├── LessonPlayerView.tsx # Lecteur de leçon
│   │   ├── MentorStudioView.tsx # Studio mentor
│   │   ├── TalentsView.tsx     # Exploration des talents
│   │   ├── MentorsView.tsx     # Exploration des mentors
│   │   ├── CompaniesView.tsx   # Exploration des entreprises
│   │   ├── PassportView.tsx    # Passeport de compétences
│   │   ├── VerificationView.tsx # Vérification de certificat
│   │   ├── ExplorerView.tsx    # Explorateur général
│   │   ├── AdminDashboardView.tsx # Tableau de bord admin
│   │   └── ...                 # Autres vues
│   │
│   ├── context/            # Contextes React (état global)
│   ├── services/           # Services d'accès aux données (Supabase)
│   ├── types/              # Types TypeScript globaux
│   ├── data/               # Données statiques / mock
│   ├── App.tsx             # Routeur principal de l'application
│   ├── main.tsx            # Point d'entrée React
│   └── index.css           # Styles globaux
│
├── supabase/
│   └── schema.sql          # Schéma PostgreSQL complet
│
├── index.html              # Template HTML racine
├── vite.config.ts          # Configuration Vite
├── tsconfig.json           # Configuration TypeScript
├── package.json            # Dépendances et scripts
└── .env.example            # Variables d'environnement (modèle)
```

---

## 🚀 Installation et démarrage

### Prérequis

- [Node.js](https://nodejs.org/) `>= 18`
- [Bun](https://bun.sh/) (recommandé) ou `npm`
- Un projet [Supabase](https://supabase.com/) actif

---

### 1. Cloner le dépôt

```bash
git clone https://github.com/kakporosaire953-creator/SkillBeidge.git
cd SkillBeidge
```

### 2. Installer les dépendances

```bash
# Avec Bun (recommandé)
bun install

# Ou avec npm
npm install
```

### 3. Configurer les variables d'environnement

Copier le fichier d'exemple et renseigner vos clés Supabase :

```bash
cp .env.example .env
```

Éditer le fichier `.env` :

```env
VITE_SUPABASE_URL=https://votre-projet.supabase.co
VITE_SUPABASE_ANON_KEY=votre_clé_anon_publique
```

> 💡 Vous trouverez ces valeurs dans votre dashboard Supabase → **Project Settings → API**

### 4. Initialiser la base de données

Dans votre dashboard Supabase, ouvrez l'éditeur SQL et exécutez le fichier :

```
supabase/schema.sql
```

Ce script crée automatiquement :
- ✅ La table `profiles` avec toutes ses colonnes
- ✅ Les index de performance
- ✅ Les triggers (`updated_at`, création automatique du profil à l'inscription)
- ✅ Les politiques Row Level Security (RLS)
- ✅ Le bucket de stockage `avatars` avec ses politiques

### 5. Lancer le serveur de développement

```bash
# Avec Bun
bun run dev

# Ou avec npm
npm run dev
```

L'application sera disponible sur → **http://localhost:5173**

---

## 📦 Scripts disponibles

| Commande | Description |
|---|---|
| `npm run dev` | Lance le serveur de développement avec hot-reload |
| `npm run build` | Compile l'application pour la production |
| `npm run preview` | Prévisualise le build de production en local |
| `npm run lint` | Vérifie les erreurs TypeScript (`tsc --noEmit`) |

---

## 🗄️ Schéma de base de données

### Table `profiles`

| Colonne | Type | Description |
|---|---|---|
| `id` | UUID | Clé primaire |
| `user_id` | UUID | Référence vers `auth.users` |
| `first_name` | TEXT | Prénom |
| `last_name` | TEXT | Nom de famille |
| `username` | TEXT | Nom d'utilisateur unique |
| `avatar_url` | TEXT | URL de l'avatar |
| `bio` | TEXT | Biographie |
| `location` | TEXT | Ville / région |
| `country` | TEXT | Pays |
| `account_type` | TEXT | `talent` \| `learner` \| `professional` \| `mentor` \| `company` \| `institution` |
| `website` | TEXT | Site web personnel |
| `linkedin_url` | TEXT | Lien LinkedIn |
| `github_url` | TEXT | Lien GitHub |
| `instagram_url` | TEXT | Lien Instagram |
| `tiktok_url` | TEXT | Lien TikTok |
| `availability` | TEXT | Disponibilité |
| `profile_visibility` | TEXT | `public` \| `private` |
| `created_at` | TIMESTAMPTZ | Date de création |
| `updated_at` | TIMESTAMPTZ | Dernière mise à jour (auto) |

---

## 🔐 Sécurité & Authentification

SkillBridge utilise **Supabase Auth** couplé au système de **Row Level Security (RLS)** de PostgreSQL.

- Chaque utilisateur ne peut **lire, modifier ou supprimer que son propre profil**
- Les profils marqués `public` sont **accessibles à tous** (explorateur, passeport public)
- Les avatars sont stockés dans un **bucket sécurisé** avec des politiques d'accès par dossier utilisateur (`avatars/{user_id}/`)
- La création du profil est **automatisée via un trigger PostgreSQL** déclenché à l'inscription

---

## 🌍 Vérification de certificats

SkillBridge propose un système de vérification publique de certificats accessible via URL :

```
https://votre-domaine.com/#verify?cert=SB-CERT-XXXXXXXXXXXX
```

Cette fonctionnalité permet à n'importe qui de valider l'authenticité d'un certificat délivré par la plateforme, sans avoir besoin de créer un compte.

---

## 🤝 Contribuer

Les contributions sont les bienvenues ! Pour contribuer :

1. **Forker** le dépôt
2. Créer une **branche** feature : `git checkout -b feature/ma-fonctionnalite`
3. **Committer** vos changements : `git commit -m "feat: ajout de ma fonctionnalité"`
4. **Pousser** la branche : `git push origin feature/ma-fonctionnalite`
5. Ouvrir une **Pull Request**

---

## 📄 Licence

Ce projet est sous licence **MIT**. Voir le fichier [LICENSE](./LICENSE) pour plus de détails.

---

<div align="center">

Fait avec ❤️ pour l'Afrique · **SkillBridge** © 2025

*"Le pont entre les compétences et les opportunités"*

</div>
