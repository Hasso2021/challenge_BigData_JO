# Frontend React - Olympic Data

Application React frontend pour l'analyse et la visualisation des données olympiques.

## Fonctionnalités

- **Page d'accueil** avec les anneaux olympiques interactifs
- **Olympic Facts** - Page dédiée aux faits historiques des Jeux Olympiques
- **Données** - Exploration des datasets olympiques
- **Visualisations** - Graphiques et analyses visuelles
- **Analyse** - Insights et analyses approfondies
- **Prédictions** - Modèles de prédiction des médailles

## Design

L'application reproduit fidèlement le design de la référence [Olympic Facts](https://diannejardinez.github.io/Olympic_Data_machine_learning/Flask-API/templates/olympic_facts.html) avec :

- Navigation moderne avec dropdown pour les visualisations
- Anneaux olympiques animés et interactifs
- Design responsive et accessible
- Couleurs officielles olympiques
- Typographie moderne (Inter)

## Installation

```bash
# Installer les dépendances
npm install

# Démarrer l'application en mode développement
npm start

# Construire pour la production
npm run build
```

## Configuration

L'application se connecte automatiquement au backend Flask sur `http://localhost:5000`.

Pour changer l'URL du backend, créez un fichier `.env` :

```
REACT_APP_API_URL=http://votre-backend-url:port/api
```

## Structure

```
src/
├── components/          # Composants réutilisables
│   ├── Navigation.js   # Barre de navigation
│   └── OlympicRings.js # Anneaux olympiques
├── pages/              # Pages de l'application
│   ├── Home.js         # Page d'accueil
│   ├── OlympicFacts.js # Faits olympiques
│   ├── Data.js         # Exploration des données
│   ├── Visualizations.js # Visualisations
│   ├── Analysis.js     # Analyses
│   └── Predictions.js  # Prédictions
├── services/           # Services API
│   └── api.js         # Client API
└── App.js             # Composant principal
```

## Technologies

- **React 18** - Framework frontend
- **React Router** - Navigation
- **Axios** - Client HTTP
- **CSS3** - Styles personnalisés
- **Responsive Design** - Mobile-first

## Intégration Backend

L'application est configurée pour fonctionner avec le backend Flask existant dans `/webapp/backend/`.

Les endpoints API attendus :
- `/api/athletes` - Données des athlètes
- `/api/medals` - Données des médailles
- `/api/results` - Résultats olympiques
- `/api/hosts` - Villes hôtes
- `/api/stats` - Statistiques

## Déploiement

```bash
# Construire l'application
npm run build

# Les fichiers de production sont dans build/
# Servir avec un serveur web statique
```
