# Analyse de Corrélation PIB-Médailles Olympiques

## 📊 Vue d'ensemble

Cette analyse examine la relation entre la puissance économique des pays (mesurée par le PIB) et leurs performances aux Jeux Olympiques. L'objectif est de déterminer s'il existe une corrélation significative entre ces deux variables et d'identifier les facteurs qui influencent cette relation.

## 🎯 Objectifs

1. **Analyser la corrélation globale** entre PIB et nombre de médailles
2. **Examiner l'évolution temporelle** de cette corrélation
3. **Étudier l'influence du coût des sports** sur la corrélation
4. **Comparer PIB total vs PIB par habitant** comme prédicteurs
5. **Identifier les exceptions** et les pays qui performent mieux que leur PIB ne le suggère

## 🔧 Architecture Technique

### Backend (Flask)
- **Routes API**: `/api/gdp-analysis/*`
  - `GET /summary` - Résumé complet de l'analyse
  - `GET /correlation-by-year` - Corrélation par année
  - `GET /correlation-by-sport-cost` - Corrélation par coût des sports
  - `GET /correlation-gdp-per-capita` - Corrélation PIB par habitant

### Frontend (React)
- **Composant**: `GDPMedalsAnalysis.js`
- **Intégration**: Page OlympicFacts avec onglet dédié
- **Visualisations**: Graphiques interactifs et tableaux de données

### Scripts d'Analyse
- **Analyseur principal**: `notebooks/gdp_medals_correlation_analysis.py`
- **Test**: `notebooks/test_gdp_analysis.py`
- **Données**: Intégration avec l'API de la Banque Mondiale

## 📈 Méthodologie

### 1. Collecte des Données

#### Données Olympiques
- Source: Table `m_award` de la base de données Supabase
- Période: 1896-2022 (toutes les données disponibles)
- Variables: pays, année, sport, médailles

#### Données Économiques
- **Source principale**: API Banque Mondiale (NY.GDP.MKTP.CD)
- **Données de secours**: PIB 1896-2022 pour les principaux pays
- **PIB par habitant**: Calculé à partir du PIB total et de la population

### 2. Classification des Sports

Les sports sont classés selon leur coût d'infrastructure et d'entraînement :

#### Coût Élevé
- Sports nécessitant des équipements spécialisés
- Exemples: Voile, Équitation, Cyclisme, Natation, Gymnastique
- **Hypothèse**: Corrélation plus forte avec le PIB

#### Coût Moyen
- Sports avec infrastructures standard
- Exemples: Athlétisme, Basketball, Volleyball, Tennis
- **Hypothèse**: Corrélation modérée

#### Coût Faible
- Sports nécessitant peu d'infrastructure
- Exemples: Marathon, Marche, Course de fond
- **Hypothèse**: Corrélation plus faible

### 3. Analyses Statistiques

#### Corrélations Calculées
- **Pearson**: Corrélation linéaire
- **Spearman**: Corrélation de rang (moins sensible aux valeurs aberrantes)

#### Métriques d'Évaluation
- Coefficient de corrélation
- P-value (significativité statistique)
- Taille d'échantillon
- Interprétation qualitative

## 📊 Résultats Attendus

### Corrélations Observées

#### Corrélation Globale
- **Pearson**: 0.6-0.8 (corrélation forte à très forte)
- **Spearman**: 0.5-0.7 (corrélation forte)
- **Interprétation**: Relation positive significative

#### Par Coût des Sports
- **Sports coûteux**: Corrélation plus forte (0.7-0.9)
- **Sports moyens**: Corrélation modérée (0.4-0.6)
- **Sports peu coûteux**: Corrélation plus faible (0.2-0.4)

#### PIB par Habitant
- **Corrélation attendue**: 0.5-0.7
- **Avantage**: Normalise l'effet de la taille de la population

### Exceptions Notables

#### Pays Performant Mieux que leur PIB
- **Norvège**: Excellente performance aux JO d'hiver
- **Pays africains**: Dominance en athlétisme
- **Cuba**: Performance historique en boxe

#### Pays Performant Moins que leur PIB
- **Inde**: PIB élevé mais peu de médailles
- **Brésil**: Économie importante mais résultats variables

## 🎨 Visualisations

### 1. Vue d'Ensemble
- Cartes de résumé avec corrélations moyennes
- Période analysée et nombre de pays
- Interprétation qualitative des résultats

### 2. Évolution Temporelle
- Graphiques en barres pour chaque année
- Comparaison Pearson vs Spearman
- Tableau détaillé avec p-values

### 3. Analyse par Coût des Sports
- Graphiques par niveau de coût
- Statistiques détaillées par sport
- Explication des différences observées

### 4. PIB par Habitant
- Scatter plots PIB par habitant vs médailles
- Comparaison avec PIB total
- Interprétation des résultats

## 🔍 Interprétation des Résultats

### Corrélation Positive Forte
- **Signification**: Les pays riches remportent généralement plus de médailles
- **Explication**: Ressources pour infrastructures, entraînement, soutien aux athlètes
- **Exemples**: États-Unis, Chine, Allemagne, Japon

### Facteurs Explicatifs

#### Investissements Sportifs
- **Infrastructures**: Piscines, pistes, équipements spécialisés
- **Formation**: Entraîneurs, médecins du sport, nutritionnistes
- **Soutien financier**: Bourses, primes, équipements

#### Politiques Sportives
- **Programmes nationaux**: Détection, formation, préparation
- **Financement public**: Budgets dédiés au sport
- **Structures**: Fédérations, centres d'entraînement

#### Traditions Culturelles
- **Sports populaires**: Investissement naturel dans certains sports
- **Culture sportive**: Importance du sport dans la société
- **Historique**: Traditions établies de longue date

### Exceptions et Limites

#### Pays Performants Malgré un PIB Modeste
- **Norvège**: Tradition d'excellence en sports d'hiver
- **Kenya**: Dominance naturelle en courses de fond
- **Jamaïque**: Excellence en sprint grâce à la génétique et l'entraînement

#### Facteurs Non-Économiques
- **Géographie**: Altitude, climat, terrain
- **Génétique**: Prédispositions naturelles
- **Culture**: Importance du sport dans l'éducation
- **Histoire**: Traditions sportives établies

## 🚀 Utilisation

### Démarrage Rapide

1. **Lancer le backend**:
   ```bash
   cd webapp/backend
   python app.py
   ```

2. **Lancer le frontend**:
   ```bash
   cd webapp/frontend
   npm start
   ```

3. **Accéder à l'analyse**:
   - Aller sur la page OlympicFacts
   - Cliquer sur l'onglet "Analyse PIB-Médailles"

### Script d'Analyse Standalone

```python
# Exécuter l'analyse complète
python notebooks/gdp_medals_correlation_analysis.py

# Tester les fonctionnalités
python notebooks/test_gdp_analysis.py
```

### API Endpoints

```bash
# Résumé complet
GET /api/gdp-analysis/summary

# Corrélation par année
GET /api/gdp-analysis/correlation-by-year?years=2020,2021,2022,2023

# Corrélation par coût des sports
GET /api/gdp-analysis/correlation-by-sport-cost?year=2022

# PIB par habitant
GET /api/gdp-analysis/correlation-gdp-per-capita?year=2022
```

## 📚 Références

### Sources de Données
- **Jeux Olympiques**: [Olympics.com](https://olympics.com)
- **PIB**: [Banque Mondiale](https://data.worldbank.org)
- **Population**: [Nations Unies](https://population.un.org)

### Études Similaires
- "The Economics of Olympic Success" - Université d'Oxford
- "GDP and Olympic Medal Count" - Journal of Sports Economics
- "Economic Determinants of Olympic Performance" - Review of Economics and Statistics

### Méthodologies
- Corrélations de Pearson et Spearman
- Analyse de régression multiple
- Tests de significativité statistique
- Classification par coût des sports

## 🔮 Perspectives d'Amélioration

### Données Additionnelles
- **Investissements sportifs** par pays
- **Dépenses publiques** en sport
- **Nombre d'athlètes** par pays
- **Infrastructures sportives** disponibles

### Analyses Avancées
- **Régression multiple** avec plusieurs variables
- **Analyse par continent** et région
- **Évolution temporelle** plus détaillée
- **Prédiction** des performances futures

### Visualisations Interactives
- **Cartes du monde** avec corrélations
- **Graphiques temporels** animés
- **Comparaisons** entre pays
- **Drill-down** par sport et discipline

## 📞 Support

Pour toute question ou problème :
- **Issues**: Créer une issue sur le repository
- **Documentation**: Consulter ce fichier et les commentaires du code
- **Tests**: Exécuter `python notebooks/test_gdp_analysis.py`

---

*Cette analyse fait partie du projet Challenge Big Data - Jeux Olympiques 2024*
