# Application de Détection d'IA pour Travaux Étudiants

Une application web professionnelle de détection d'utilisation d'IA dans les travaux d'étudiants, spécialisée pour les textes en langue française.

## 🚀 Fonctionnalités

- **Détection IA Multi-Sources** : Intégration avec Originality.ai, Winston AI, et OpenAI
- **Analyse Spécialisée Français** : Algorithmes optimisés pour la langue française
- **Deux Modes d'Analyse** : Rapide (30s) et Avancée (2min)
- **Upload de Fichiers** : Support PDF, Word (.docx), et TXT
- **Rapports Détaillés** : Graphiques radar, analyse par sections, export PDF
- **Interface Intuitive** : Aucune inscription requise, utilisation directe

## 🔧 Configuration des APIs

Pour utiliser les vraies APIs de détection, configurez les variables d'environnement :

```bash
# Copiez .env.example vers .env et remplissez vos clés API
cp .env.example .env
```

### APIs Supportées

1. **Originality.ai** - API de référence pour la détection IA
   - Obtenez votre clé sur https://originality.ai/
   - Variable : `VITE_ORIGINALITY_API_KEY`

2. **Winston AI** - Détection IA spécialisée
   - Obtenez votre clé sur https://gowinston.ai/
   - Variable : `VITE_WINSTON_API_KEY`

3. **OpenAI** - Utilise GPT-4 pour l'analyse
   - Obtenez votre clé sur https://platform.openai.com/
   - Variable : `VITE_OPENAI_API_KEY`

4. **Supabase** - Base de données (optionnel)
   - Variables : `VITE_SUPABASE_URL` et `VITE_SUPABASE_ANON_KEY`

## 🏗️ Architecture

- **Frontend** : React + TypeScript + Tailwind CSS
- **APIs** : Intégration multi-sources avec fallback local
- **Graphiques** : Chart.js pour les visualisations
- **Export** : jsPDF pour les rapports
- **Base de données** : Supabase (optionnel)

## 📊 Indicateurs d'Analyse

L'application analyse 8 indicateurs clés :

1. **Diversité Lexicale** - Variété du vocabulaire utilisé
2. **Complexité Syntaxique** - Structure et variation des phrases
3. **Cohérence Sémantique** - Logique et fluidité du contenu
4. **Patterns Répétitifs** - Détection de structures récurrentes
5. **Richesse Vocabulaire** - Utilisation de termes complexes
6. **Variation des Phrases** - Diversité dans la construction
7. **Fluidité Naturelle** - Transitions et connecteurs logiques
8. **Spécificité Française** - Patterns typiques de l'IA en français

## 🎯 Fiabilité

- **Multi-Sources** : Combine plusieurs APIs professionnelles
- **Spécialisé Français** : Algorithmes adaptés à la langue française
- **Analyse Locale** : Fallback intelligent en cas d'indisponibilité des APIs
- **Validation Croisée** : Corrélation entre différentes sources

## 🚀 Démarrage

```bash
# Installation des dépendances
npm install

# Démarrage en développement
npm run dev

# Build pour production
npm run build
```

## 📈 Utilisation

1. **Sélectionnez le mode d'analyse** (Rapide ou Avancée)
2. **Saisissez votre texte** ou **uploadez un fichier**
3. **Lancez l'analyse** - Les APIs sont appelées automatiquement
4. **Consultez le rapport** avec scores détaillés et graphiques
5. **Exportez en PDF** pour archivage ou partage

## 🔒 Confidentialité

- Aucune inscription requise
- Données traitées de manière sécurisée
- Option de sauvegarde locale uniquement
- Respect des politiques de confidentialité des APIs

## 📞 Support

Cette application utilise les meilleures APIs du marché pour garantir une détection fiable et précise de l'utilisation d'IA dans les travaux académiques.