# 🚀 Guide de Déploiement sur Vercel

Ce guide vous explique comment déployer le projet MH sur Vercel en quelques étapes simples.

## ✅ Prérequis

- Compte GitHub (le repo est public)
- Compte Vercel (créez-le gratuitement sur https://vercel.com)

## 📋 Étapes du Déploiement

### Option 1 : Déploiement Automatique (Recommandé)

1. **Allez sur Vercel :** https://vercel.com/dashboard
2. **Cliquez sur "New Project"**
3. **Importez le repository GitHub :**
   - Cherchez `MH-GESTION`
   - Cliquez sur "Import"
4. **Configurez le projet :**
   - **Project Name :** `mh-gestion` (ou un autre nom)
   - **Framework Preset :** Next.js (détecté automatiquement)
   - **Root Directory :** `./`
   - **Build Command :** `npm run build`
   - **Output Directory :** `.next`
   - **Install Command :** `npm ci`

5. **Cliquez sur "Deploy"** ✨

Vercel va automatiquement :
- ✅ Installer les dépendances
- ✅ Générer la build Next.js
- ✅ Créer un domaine URL
- ✅ Configurer HTTPS SSL

### Option 2 : Déploiement par CLI

```bash
# 1. Installer Vercel CLI
npm install -g vercel

# 2. Se connecter à Vercel
vercel login

# 3. Aller au répertoire du projet
cd c:\Users\elaid\OneDrive\Desktop\app\gestion-produit

# 4. Déployer
vercel

# 5. Répondre aux questions (garder les valeurs par défaut)
```

## 🔗 Après le Déploiement

Vous recevrez :
- **URL publique :** `https://mh-gestion.vercel.app` (ou similaire)
- **Dashboard Vercel :** pour gérer votre app
- **Logs en direct :** voir les erreurs et problèmes

## 🔄 Mises à Jour Automatiques

Chaque fois que vous poussez sur GitHub (branche main) :
1. Vercel détecte automatiquement les changements
2. Recrée la build
3. Redéploie l'application
4. Vous recevez une notification

## 🔧 Configuration Vercel

Tous les fichiers de configuration sont déjà en place :
- `vercel.json` - Configuration Vercel
- `next.config.js` - Configuration Next.js
- `.nvmrc` - Version Node.js (18)
- `.env.example` - Variables d'environnement (si besoin)

## 🐛 Dépannage

### Le build échoue ❌

```bash
# Vérifier localement
npm run build

# Vérifier les types TypeScript
npm run type-check

# Voir les logs Vercel
vercel logs
```

### Erreurs d'import

S'assurer que tous les imports sont corrects :
```tsx
// ✅ BON
import './globals.css';

// ❌ MAUVAIS
import './globals';
```

### localStorage ne fonctionne pas

Le code utilise déjà `localStorage` qui n'est disponible que côté client. C'est géré avec `'use client'` au début de `app/page.tsx`.

## 📊 Monitoring

Sur le dashboard Vercel, vous pouvez :
- Voir les **Performance Metrics**
- Consulter les **Function Logs**
- Gérer les **Deployments**
- Configurer les **Environment Variables**

## 🎉 Bravo !

Votre application MH est maintenant déployée sur Vercel ! 

**URL :** https://mh-gestion.vercel.app (ou votre URL personnalisée)

## 📚 Ressources

- [Documentation Vercel](https://vercel.com/docs)
- [Documentation Next.js](https://nextjs.org/docs)
- [GitHub Repository](https://github.com/helaidi-web/MH-GESTION)

---

**Besoin d'aide ?** Consultez les logs Vercel ou créez un issue sur GitHub.
