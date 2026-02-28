# 🎯 MH - Gestion de Produits Premium

Une application web magnifique et moderne pour la gestion complète de produits et de clients, construite avec **Next.js** et React.

## ✨ Fonctionnalités Principales

### 📊 Tableau de Bord
- Statistiques en temps réel
- Cartes animées avec graphiques
- Visualisation des derniers produits ajoutés

### 📦 Gestion des Produits
- Ajouter, modifier, supprimer des produits
- Recherche en temps réel
- Affichage par catégorie avec emojis
- Détails complets accessibles
- Sauvegarde automatique en localStorage

### 👥 Gestion des Clients
- Visualisation des clients uniques
- Recherche par nom ou email
- Statistiques d'achat par client
- Historique des commandes

### 💳 Informations Complètes
- **Produit**: Nom, Numéro, Prix, Quantité, Catégorie, Description
- **Client**: Nom, Email, Téléphone, Adresse, Ville, Pays
- **Paiement**: Mode de paiement, Numéro de facture, Date, Statut de commande

## 🎨 Design
- Dark mode élégant avec gradients modernes
- Animations fluides et transitions
- Responsive design (mobile, tablette, desktop)
- Interface utilisateur intuitive
- Emojis pour meilleure UX

## 💾 Stockage
- Sauvegarde automatique dans localStorage
- Données persistantes dans le navigateur

## 🚀 Installation & Démarrage

### Prérequis
- Node.js 16+ 
- npm ou yarn

### Installation locale
```bash
# Cloner le repo
git clone https://github.com/helaidi-web/MH-GESTION.git
cd MH-GESTION

# Installer les dépendances
npm install

# Démarrer le serveur de développement
npm run dev

# Ouvrir http://localhost:3000 dans le navigateur
```

### Build pour production
```bash
npm run build
npm start
```

## 🌐 Déploiement sur Vercel

### Option 1 : Automatique (Recommandé)
1. Allez sur https://vercel.com
2. Connectez-vous avec GitHub
3. Importez le repo `MH-GESTION`
4. Cliquez sur "Deploy"

### Option 2 : CLI
```bash
npm install -g vercel
vercel
```

> Le site sera accessible à : `https://[votre-app].vercel.app`

## 📁 Structure du Projet
```
MH-GESTION/
├── app/
│   ├── layout.tsx          # Layout root
│   ├── page.tsx            # Page principale (composant client)
│   └── globals.css         # Styles globaux
├── public/                 # Assets statiques
├── package.json            # Dépendances & scripts
├── next.config.js         # Configuration Next.js
├── tsconfig.json          # Configuration TypeScript
├── vercel.json           # Configuration Vercel
├── .eslintrc.json        # Configuration ESLint
├── .gitignore            # Fichiers à ignorer
└── README.md             # Ce fichier
```

## 🔧 Technologie Stack
- **Framework**: Next.js 14
- **Runtime**: React 18+
- **Langage**: TypeScript
- **Styling**: CSS3 vanilla (gradients, animations, flexbox, grid)
- **State**: React Hooks (useState, useEffect)
- **Storage**: localStorage
- **Hosting**: Vercel

## 📜 Scripts NPM
```bash
npm run dev       # Mode développement (http://localhost:3000)
npm run build     # Build production
npm start         # Démarrer le serveur production
npm run lint      # Exécuter ESLint
```

## 📱 Navigateurs Supportés
- Chrome/Chromium (dernières versions)
- Firefox (dernières versions)
- Safari (dernières versions)
- Edge (dernières versions)

## 🔐 Sécurité
- Headers de sécurité configurés dans vercel.json
- CSP activé
- XSS Protection activé
- No sensitive data in client code

## 📝 Configuration Environnement
Le projet utilise des variables d'environnement Vercel (voir vercel.json):
- `NODE_ENV`: production

## 🤝 Contribution
Les contributions sont bienvenues ! N'hésitez pas à forker et créer des pull requests.

## 📄 Licence
MIT

---

⭐ **N'oublie pas de mettre une star si tu aimes le projet !**

🌟 Rendez belle votre gestion de produits avec MH !

- Chrome/Chromium (dernières versions)
- Firefox (dernières versions)
- Safari (dernières versions)
- Edge (dernières versions)

## 👤 Auteur
MH Team

## 📝 Licence
MIT

---

🌟 Rendez belle votre gestion de produits !
