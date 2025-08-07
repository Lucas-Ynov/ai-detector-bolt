# 🚀 Guide Complet - Mise à Jour GitHub

## 🎯 Objectif
Mettre à jour votre repository GitHub `ai-detector-bolt` avec les dernières corrections pour que le site fonctionne sur GitHub Pages.

---

## 📋 Méthode 1: Interface Web GitHub (RECOMMANDÉE - Plus Simple)

### Étape 1: Accéder à votre repository
1. Allez sur https://github.com/lucas-ynov/ai-detector-bolt
2. Connectez-vous à votre compte GitHub

### Étape 2: Modifier les fichiers un par un

#### A. Modifier `vite.config.ts`
1. Cliquez sur le fichier `vite.config.ts`
2. Cliquez sur l'icône crayon ✏️ "Edit this file"
3. Remplacez TOUT le contenu par :

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: process.env.NODE_ENV === 'production' ? '/ai-detector-bolt/' : '/',
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
});
```

4. Scrollez en bas, ajoutez le message de commit : "Fix vite config for GitHub Pages"
5. Cliquez sur "Commit changes"

#### B. Modifier `index.html`
1. Cliquez sur le fichier `index.html`
2. Cliquez sur l'icône crayon ✏️
3. Trouvez la ligne avec `href="/vite.svg"`
4. Remplacez-la par `href="./vite.svg"`
5. Commit avec le message : "Fix icon path for GitHub Pages"

#### C. Modifier `package.json`
1. Cliquez sur le fichier `package.json`
2. Cliquez sur l'icône crayon ✏️
3. Dans la section `"scripts"`, ajoutez cette ligne après `"preview"` :
```json
"build:github": "vite build --base=/ai-detector-bolt/",
```
4. Commit avec le message : "Add GitHub Pages build script"

#### D. Créer le workflow GitHub Actions
1. Cliquez sur "Create new file"
2. Nommez le fichier : `.github/workflows/deploy.yml`
3. Collez ce contenu :

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout
      uses: actions/checkout@v4
      
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '18'
        cache: 'npm'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Build for GitHub Pages
      run: npm run build:github
      
    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      if: github.ref == 'refs/heads/main'
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./dist
```

4. Commit avec le message : "Add GitHub Actions workflow"

#### E. Créer le fichier 404.html
1. Cliquez sur "Create new file"
2. Nommez le fichier : `public/404.html`
3. Collez ce contenu :

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>AI Detection Pro</title>
    <script type="text/javascript">
      var pathSegmentsToKeep = 1;
      var l = window.location;
      l.replace(
        l.protocol + '//' + l.hostname + (l.port ? ':' + l.port : '') +
        l.pathname.split('/').slice(0, 1 + pathSegmentsToKeep).join('/') + 
        '/?/' +
        l.pathname.slice(1).split('/').slice(pathSegmentsToKeep).join('/').replace(/&/g, '~and~') +
        (l.search ? '&' + l.search.slice(1).replace(/&/g, '~and~') : '') +
        l.hash
      );
    </script>
  </head>
  <body>
  </body>
</html>
```

4. Commit avec le message : "Add 404.html for SPA routing"

### Étape 3: Activer GitHub Pages
1. Allez dans **Settings** de votre repository
2. Scrollez jusqu'à **Pages** dans le menu de gauche
3. Dans **Source**, sélectionnez **"GitHub Actions"**
4. Sauvegardez

---

## 📋 Méthode 2: Git en Ligne de Commande

Si vous préférez utiliser Git :

```bash
# 1. Cloner ou aller dans votre projet
git clone https://github.com/lucas-ynov/ai-detector-bolt.git
cd ai-detector-bolt

# 2. Créer une nouvelle branche
git checkout -b fix-github-pages

# 3. Faire les modifications (utilisez les fichiers de la Méthode 1)

# 4. Ajouter et commiter
git add .
git commit -m "Fix GitHub Pages deployment"

# 5. Pousser
git push origin fix-github-pages

# 6. Créer une Pull Request sur GitHub
```

---

## 📋 Méthode 3: Télécharger et Re-upload

1. **Téléchargez** votre repository actuel (bouton "Code" > "Download ZIP")
2. **Extrayez** le ZIP
3. **Modifiez** les fichiers selon la Méthode 1
4. **Créez un nouveau repository** ou **remplacez** les fichiers existants

---

## ✅ Vérification

Après avoir fait les modifications :

1. **Vérifiez** que le workflow s'exécute dans l'onglet "Actions"
2. **Attendez** 2-3 minutes que le déploiement se termine
3. **Visitez** https://lucas-ynov.github.io/ai-detector-bolt/

---

## 🆘 Aide Supplémentaire

Si vous rencontrez des problèmes :

1. **Vérifiez** les logs dans l'onglet "Actions"
2. **Assurez-vous** que GitHub Pages est activé
3. **Vérifiez** que tous les fichiers ont été modifiés correctement

---

## 🎯 Résumé des Fichiers à Modifier

- ✅ `vite.config.ts` - Configuration Vite
- ✅ `index.html` - Chemin de l'icône
- ✅ `package.json` - Script de build
- ✅ `.github/workflows/deploy.yml` - Workflow (nouveau)
- ✅ `public/404.html` - Gestion SPA (nouveau)

Une fois terminé, votre site devrait fonctionner parfaitement sur GitHub Pages !