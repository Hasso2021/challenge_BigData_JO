# Guide de Test - Frontend React

## Prérequis

1. **Backend Flask** doit être en cours d'exécution sur `http://localhost:5000`
2. **Base de données** configurée et accessible
3. **Node.js** et **npm** installés

## Démarrage de l'Application

### 1. Installer les dépendances
```bash
cd webapp/frontend
npm install
```

### 2. Démarrer le backend Flask
```bash
cd webapp/backend
python app.py
```

### 3. Démarrer le frontend React
```bash
cd webapp/frontend
npm start
```

L'application sera disponible sur `http://localhost:3000`

## Test des Fonctionnalités

### Page Data (`http://localhost:3000/data`)

1. **Cliquer sur "Athlètes"**
   - Vérifier que les données s'affichent
   - Tester les filtres (Pays, Sport, Année, Genre)
   - Tester la recherche
   - Tester la pagination

2. **Cliquer sur "Médailles"**
   - Vérifier l'affichage des médailles
   - Tester les filtres (Pays, Type de Médaille, Année, Sport)
   - Vérifier les badges de médailles (Or, Argent, Bronze)

3. **Cliquer sur "Résultats"**
   - Vérifier l'affichage des résultats
   - Tester les filtres (Pays, Sport, Année, Saison)

4. **Cliquer sur "Villes Hôtes"**
   - Vérifier l'affichage des villes hôtes
   - Tester les filtres (Pays, Année, Saison)

### Fonctionnalités à Tester

#### Filtres
- **Sélection par pays** : Choisir un pays dans le dropdown
- **Filtres par année** : Utiliser les champs min/max
- **Filtres par sport** : Sélectionner un sport
- **Filtres par genre** : Sélectionner M ou F
- **Effacer les filtres** : Bouton "Effacer les filtres"

#### Recherche
- **Recherche textuelle** : Taper dans le champ de recherche
- **Recherche en temps réel** : Vérifier que les résultats se mettent à jour

#### Pagination
- **Navigation** : Boutons Précédent/Suivant
- **Informations de page** : Vérifier l'affichage "Page X sur Y"

#### Tri
- **Tri par colonnes** : Cliquer sur les en-têtes de colonnes
- **Indicateurs de tri** : Vérifier les flèches ↑/↓

## Gestion des Erreurs

### Erreurs de Connexion
- **Backend non démarré** : Message d'erreur approprié
- **Erreur 500** : Affichage du message d'erreur du backend
- **Timeout** : Gestion des timeouts de requête

### États de Chargement
- **Loading** : Spinner pendant le chargement
- **No Data** : Message quand aucune donnée
- **Error** : Affichage des erreurs

## Structure des Données Attendues

### Athlètes
```json
{
  "status": "success",
  "data": [
    {
      "name": "Nom de l'athlète",
      "country": "Pays",
      "sport": "Sport",
      "year": 2020,
      "gender": "M/F",
      "age": 25
    }
  ],
  "total": 1000
}
```

### Médailles
```json
{
  "status": "success",
  "data": [
    {
      "athlete_name": "Nom de l'athlète",
      "country": "Pays",
      "sport": "Sport",
      "event": "Événement",
      "medal_type": "Gold/Silver/Bronze",
      "year": 2020
    }
  ],
  "total": 500
}
```

## Debugging

### Console du Navigateur
- Ouvrir les DevTools (F12)
- Vérifier les requêtes API dans l'onglet Network
- Vérifier les erreurs dans l'onglet Console

### Logs Backend
- Vérifier les logs du serveur Flask
- Vérifier les requêtes SQL dans les logs

## Problèmes Courants

1. **CORS Error** : Vérifier la configuration CORS dans Flask
2. **404 Error** : Vérifier que les routes sont correctement enregistrées
3. **500 Error** : Vérifier la connexion à la base de données
4. **Données vides** : Vérifier que la base de données contient des données

## Améliorations Futures

- [ ] Cache des données côté client
- [ ] Export des données (CSV, Excel)
- [ ] Graphiques interactifs
- [ ] Filtres avancés
- [ ] Sauvegarde des préférences utilisateur
