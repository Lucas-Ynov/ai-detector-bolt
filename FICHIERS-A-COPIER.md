# 📁 Fichiers à Copier pour GitHub

## 🎯 Instructions Rapides

Copiez ces contenus dans les fichiers correspondants de votre repository GitHub.

---

## 📄 1. `vite.config.ts`

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

---

## 📄 2. `index.html` (Modification)

Trouvez cette ligne :
```html
<link rel="icon" type="image/svg+xml" href="/vite.svg" />
```

Remplacez par :
```html
<link rel="icon" type="image/svg+xml" href="./vite.svg" />
```

---

## 📄 3. `package.json` (Ajout dans scripts)

Ajoutez cette ligne dans la section `"scripts"` :
```json
"build:github": "vite build --base=/ai-detector-bolt/",
```

Exemple complet de la section scripts :
```json
"scripts": {
  "dev": "vite",
  "build": "vite build",
  "build:github": "vite build --base=/ai-detector-bolt/",
  "lint": "eslint .",
  "preview": "vite preview"
},
```

---

## 📄 4. `.github/workflows/deploy.yml` (NOUVEAU FICHIER)

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

---

## 📄 5. `public/404.html` (NOUVEAU FICHIER)

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

---

## ⚡ Ordre de Modification

1. **Modifiez** `vite.config.ts`
2. **Modifiez** `index.html`
3. **Modifiez** `package.json`
4. **Créez** `.github/workflows/deploy.yml`
5. **Créez** `public/404.html`
6. **Activez** GitHub Pages dans Settings > Pages > Source: "GitHub Actions"

---

## 🎯 Résultat Attendu

Après ces modifications, votre site sera accessible sur :
**https://lucas-ynov.github.io/ai-detector-bolt/**

Et il fonctionnera parfaitement sans page blanche !