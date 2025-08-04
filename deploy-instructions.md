# 🚀 Instructions de Déploiement GitHub Pages

## Méthode 1: Script Automatique (Recommandé)

1. **Ouvrez un terminal** dans le dossier de votre projet
2. **Rendez le script exécutable** :
   ```bash
   chmod +x deploy-to-github.sh
   ```
3. **Exécutez le script** :
   ```bash
   ./deploy-to-github.sh
   ```

## Méthode 2: Commandes Manuelles

```bash
# 1. Construire pour GitHub Pages
npm run build:github

# 2. Ajouter tous les fichiers
git add .

# 3. Commit
git commit -m "Fix GitHub Pages deployment - improved AI detection and PDF design"

# 4. Push
git push origin main
```

## Méthode 3: Interface GitHub (Sans Git local)

### Fichiers à modifier sur GitHub.com :

#### 1. `vite.config.ts`
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

#### 2. `index.html` - Modifier la ligne de l'icône :
```html
<link rel="icon" type="image/svg+xml" href="./vite.svg" />
```

#### 3. `package.json` - Ajouter dans scripts :
```json
"build:github": "vite build --base=/ai-detector-bolt/",
```

#### 4. Créer `public/404.html` :
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

## ✅ Vérification

Après le déploiement :
1. Allez dans **Settings > Pages** de votre repo
2. Vérifiez que la source est "GitHub Actions"
3. Attendez 2-3 minutes
4. Visitez : https://lucas-ynov.github.io/ai-detector-bolt/

## 🆘 En cas de problème

- Vérifiez les logs dans l'onglet "Actions" de votre repository
- Assurez-vous que GitHub Pages est activé
- Contactez-moi si vous avez des erreurs spécifiques