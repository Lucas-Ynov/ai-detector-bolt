#!/bin/bash

echo "🚀 Script de déploiement GitHub Pages"
echo "======================================"

# Vérifier si on est dans un repo git
if [ ! -d ".git" ]; then
    echo "❌ Erreur: Ce n'est pas un repository Git"
    exit 1
fi

# Construire pour GitHub Pages
echo "📦 Construction pour GitHub Pages..."
npm run build:github

if [ $? -ne 0 ]; then
    echo "❌ Erreur lors de la construction"
    exit 1
fi

# Ajouter tous les fichiers modifiés
echo "📝 Ajout des fichiers modifiés..."
git add .

# Commit
echo "💾 Commit des changements..."
git commit -m "Fix GitHub Pages deployment - improved AI detection and PDF design"

# Push
echo "🚀 Push vers GitHub..."
git push origin main

if [ $? -eq 0 ]; then
    echo "✅ Déploiement réussi!"
    echo "🌐 Votre site sera disponible dans quelques minutes à:"
    echo "   https://lucas-ynov.github.io/ai-detector-bolt/"
    echo ""
    echo "📋 Vérifiez le déploiement dans:"
    echo "   Settings > Pages de votre repository GitHub"
else
    echo "❌ Erreur lors du push"
    exit 1
fi