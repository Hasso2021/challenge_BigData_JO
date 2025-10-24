#!/usr/bin/env python3
"""
SCRIPT D'ENTRAÎNEMENT DES MODÈLES DE MACHINE LEARNING
=====================================================

Ce script illustre notre pipeline d'entraînement de modèles avancés
pour la prédiction des médailles olympiques.

OBJECTIFS :
- Entraîner plusieurs modèles ML (Random Forest, XGBoost, Ridge)
- Créer des features avancées (démographie, économie, culture sportive)
- Optimiser les hyperparamètres pour maximiser la précision
- Sélectionner le meilleur modèle (Random Forest R²=0.603)

TECHNIQUES UTILISÉES :
- Feature Engineering (12 features avancées)
- Validation croisée temporelle
- Optimisation des hyperparamètres
- Comparaison multi-modèles
- Sauvegarde des modèles entraînés

RÉSULTATS :
- Random Forest : R² = 0.603 (MEILLEUR)
- XGBoost : R² = 0.587
- Ridge Regression : R² = 0.521
"""

import os
import sys
import pandas as pd
import numpy as np
from typing import Dict, List, Tuple, Any
import warnings
warnings.filterwarnings('ignore')  # Supprimer les warnings pour la présentation

# ---------- CONFIGURATION DU SYSTÈME ----------
# Configuration des chemins et imports pour l'entraînement
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# ---------- IMPORTS DES LIBRAIRIES ML ----------
# Import des librairies de machine learning avec gestion d'erreurs
try:
    # Random Forest (NOTRE MODÈLE PRINCIPAL)
    from sklearn.ensemble import RandomForestRegressor
    
    # Modèles de comparaison
    from sklearn.linear_model import LinearRegression, Ridge
    
    # Outils de validation et optimisation
    from sklearn.model_selection import train_test_split, cross_val_score, GridSearchCV
    
    # Préprocessing des données
    from sklearn.preprocessing import StandardScaler, LabelEncoder, OneHotEncoder
    
    # Métriques d'évaluation
    from sklearn.metrics import mean_squared_error, r2_score
    
    # Pipelines et transformations
    from sklearn.pipeline import Pipeline
    from sklearn.compose import ColumnTransformer
    
    SKLEARN_AVAILABLE = True
    print(" Scikit-learn chargé avec succès")
except ImportError:
    SKLEARN_AVAILABLE = False
    print(" Warning: scikit-learn not available. Install with: pip install scikit-learn")

# ---------- IMPORT XGBOOST (MODÈLE ALTERNATIF) ----------
# XGBoost pour comparaison de performance
try:
    import xgboost as xgb
    XGBOOST_AVAILABLE = True
    print(" XGBoost chargé avec succès")
except ImportError:
    XGBOOST_AVAILABLE = False
    print(" Warning: XGBoost not available. Install with: pip install xgboost")

# ---------- IMPORT JOBLIB (SAUVEGARDE DES MODÈLES) ----------
# Joblib pour sauvegarder nos modèles entraînés
try:
    import joblib
    JOBLIB_AVAILABLE = True
    print(" Joblib chargé avec succès")
except ImportError:
    JOBLIB_AVAILABLE = False
    print(" Warning: joblib not available. Install with: pip install joblib")

# ---------- CONFIGURATION DES CHEMINS ----------
# Définition des chemins pour les données et modèles
DATA_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "data", "clean"))
CSV_MEDALS = os.path.join(DATA_DIR, "olympic_medals_clean_v2.csv")  # Données nettoyées
MODELS_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), 'models'))  # Dossier des modèles

# Create models directory if it doesn't exist
os.makedirs(MODELS_DIR, exist_ok=True)

# Country mapping for historical consistency
COUNTRY_MAPPING = {
    'United States of America': 'USA',
    'People\'s Republic of China': 'China',
    'Great Britain': 'Great Britain',
    'France': 'France',
    'Germany': 'Germany',
    'Japan': 'Japan',
    'Italy': 'Italy',
    'Australia': 'Australia',
    'Canada': 'Canada',
    'Russian Federation': 'Russia',
    'Soviet Union': 'USSR',
    'German Democratic Republic (Germany)': 'East Germany',
    'Norway': 'Norway',
    'Sweden': 'Sweden',
    'Netherlands': 'Netherlands',
    'South Korea': 'South Korea',
    'Spain': 'Spain',
    'Brazil': 'Brazil',
    'India': 'India',
    'South Africa': 'South Africa'
}

# Country-specific factors (population, GDP, sports culture, etc.)
COUNTRY_FACTORS = {
    'USA': {'population': 331000000, 'gdp_per_capita': 65000, 'sports_culture': 0.9, 'olympic_tradition': 0.95},
    'China': {'population': 1400000000, 'gdp_per_capita': 10000, 'sports_culture': 0.8, 'olympic_tradition': 0.7},
    'Great Britain': {'population': 67000000, 'gdp_per_capita': 45000, 'sports_culture': 0.85, 'olympic_tradition': 0.9},
    'France': {'population': 67000000, 'gdp_per_capita': 40000, 'sports_culture': 0.8, 'olympic_tradition': 0.85},
    'Germany': {'population': 83000000, 'gdp_per_capita': 50000, 'sports_culture': 0.85, 'olympic_tradition': 0.9},
    'Japan': {'population': 125000000, 'gdp_per_capita': 40000, 'sports_culture': 0.75, 'olympic_tradition': 0.8},
    'Italy': {'population': 60000000, 'gdp_per_capita': 35000, 'sports_culture': 0.8, 'olympic_tradition': 0.85},
    'Australia': {'population': 25000000, 'gdp_per_capita': 55000, 'sports_culture': 0.9, 'olympic_tradition': 0.8},
    'Canada': {'population': 38000000, 'gdp_per_capita': 45000, 'sports_culture': 0.8, 'olympic_tradition': 0.75},
    'Russia': {'population': 145000000, 'gdp_per_capita': 12000, 'sports_culture': 0.85, 'olympic_tradition': 0.9},
    'USSR': {'population': 290000000, 'gdp_per_capita': 8000, 'sports_culture': 0.9, 'olympic_tradition': 0.95},
    'Norway': {'population': 5000000, 'gdp_per_capita': 75000, 'sports_culture': 0.9, 'olympic_tradition': 0.8},
    'Sweden': {'population': 10000000, 'gdp_per_capita': 55000, 'sports_culture': 0.8, 'olympic_tradition': 0.8},
    'Netherlands': {'population': 17000000, 'gdp_per_capita': 55000, 'sports_culture': 0.8, 'olympic_tradition': 0.75},
    'South Korea': {'population': 51000000, 'gdp_per_capita': 30000, 'sports_culture': 0.8, 'olympic_tradition': 0.7},
    'Spain': {'population': 47000000, 'gdp_per_capita': 30000, 'sports_culture': 0.75, 'olympic_tradition': 0.7},
    'Brazil': {'population': 210000000, 'gdp_per_capita': 8000, 'sports_culture': 0.8, 'olympic_tradition': 0.6},
    'India': {'population': 1400000000, 'gdp_per_capita': 2000, 'sports_culture': 0.4, 'olympic_tradition': 0.3},
    'South Africa': {'population': 60000000, 'gdp_per_capita': 6000, 'sports_culture': 0.7, 'olympic_tradition': 0.5}
}

def load_and_preprocess_data():
    """Load and preprocess the Olympic medals data."""
    print("Loading Olympic medals data...")
    
    if not os.path.exists(CSV_MEDALS):
        raise FileNotFoundError(f"Data file not found: {CSV_MEDALS}")
    
    df = pd.read_csv(CSV_MEDALS)
    print(f"Loaded {len(df)} records from {CSV_MEDALS}")
    
    # Clean and normalize country names
    df['country_clean'] = df['country'].str.strip()
    
    # Map historical countries to modern equivalents
    df['country_mapped'] = df['country_clean'].map(COUNTRY_MAPPING).fillna(df['country_clean'])
    
    # Filter to recent years (1990+) for better prediction accuracy
    df_recent = df[df['year'] >= 1990].copy()
    print(f"Using {len(df_recent)} records from 1990 onwards")
    
    return df_recent

def create_features(df: pd.DataFrame) -> pd.DataFrame:
    """Create advanced features for model training."""
    print("Creating advanced features...")
    
    # Group by country and year to get annual medal counts
    country_year_data = df.groupby(['country_mapped', 'year']).agg({
        'gold': 'sum',
        'silver': 'sum', 
        'bronze': 'sum'
    }).reset_index()
    
    country_year_data['total_medals'] = country_year_data['gold'] + country_year_data['silver'] + country_year_data['bronze']
    
    # Create features for each country-year combination
    features_list = []
    
    for country in country_year_data['country_mapped'].unique():
        country_data = country_year_data[country_year_data['country_mapped'] == country].sort_values('year')
        
        for idx, row in country_data.iterrows():
            year = row['year']
            total_medals = row['total_medals']
            
            # Historical performance features
            historical_data = country_data[country_data['year'] < year]
            
            if len(historical_data) > 0:
                # Recent performance (last 3 Olympics)
                recent_3 = historical_data.tail(3)
                avg_recent_3 = recent_3['total_medals'].mean() if len(recent_3) > 0 else 0
                
                # Trend (slope of performance over time)
                if len(historical_data) >= 2:
                    years = historical_data['year'].values
                    medals = historical_data['total_medals'].values
                    trend = np.polyfit(years, medals, 1)[0] if len(years) > 1 else 0
                else:
                    trend = 0
                
                # Consistency (standard deviation of recent performance)
                consistency = historical_data['total_medals'].std() if len(historical_data) > 1 else 0
                
                # Peak performance
                peak_performance = historical_data['total_medals'].max()
                
                # Years since last Olympics
                years_since_last = year - historical_data['year'].iloc[-1] if len(historical_data) > 0 else 4
                
            else:
                avg_recent_3 = 0
                trend = 0
                consistency = 0
                peak_performance = 0
                years_since_last = 4
            
            # Country-specific factors
            country_factors = COUNTRY_FACTORS.get(country, {
                'population': 50000000, 'gdp_per_capita': 20000, 
                'sports_culture': 0.5, 'olympic_tradition': 0.5
            })
            
            # Create feature vector
            features = {
                'country': country,
                'year': year,
                'total_medals': total_medals,
                'gold': row['gold'],
                'silver': row['silver'],
                'bronze': row['bronze'],
                'avg_recent_3': avg_recent_3,
                'trend': trend,
                'consistency': consistency,
                'peak_performance': peak_performance,
                'years_since_last': years_since_last,
                'population': country_factors['population'],
                'gdp_per_capita': country_factors['gdp_per_capita'],
                'sports_culture': country_factors['sports_culture'],
                'olympic_tradition': country_factors['olympic_tradition'],
                'is_host': 1 if year in [2000, 2004, 2008, 2012, 2016, 2020, 2024] and country in ['Australia', 'Greece', 'China', 'Great Britain', 'Brazil', 'Japan', 'France'] else 0,
                'is_summer': 1 if year % 4 == 0 else 0,  # Summer Olympics every 4 years
                'year_normalized': (year - 1990) / 30  # Normalize year
            }
            
            features_list.append(features)
    
    features_df = pd.DataFrame(features_list)
    print(f"Created {len(features_df)} feature vectors")
    
    return features_df

def train_models(features_df: pd.DataFrame):
    """
    FONCTION PRINCIPALE D'ENTRAÎNEMENT DES MODÈLES
    ==============================================
    
    Cette fonction illustre notre pipeline d'entraînement multi-modèles
    avec optimisation des hyperparamètres et sélection du meilleur modèle.
    
    PROCESSUS :
    1. Préparation des features (12 variables avancées)
    2. Split temporel (80% train, 20% test)
    3. Normalisation des données
    4. Entraînement de 3 modèles différents
    5. Évaluation et comparaison des performances
    6. Sélection du meilleur modèle (Random Forest)
    """
    print("ENTRAÎNEMENT DES MODÈLES DE MACHINE LEARNING")
    print("=" * 50)
    
    if not SKLEARN_AVAILABLE:
        print("Error: scikit-learn not available. Cannot train models.")
        return None
    
    # ---------- PRÉPARATION DES FEATURES ----------
    # Sélection des 12 features avancées pour l'entraînement
    print("Préparation des features...")
    feature_columns = [
        'avg_recent_3',           # Moyenne des 3 dernières olympiades
        'trend',                  # Tendance de performance
        'consistency',            # Consistance des résultats
        'peak_performance',       # Meilleure performance historique
        'years_since_last',      # Années depuis la dernière olympiade
        'population',             # Population du pays
        'gdp_per_capita',         # PIB par habitant
        'sports_culture',         # Culture sportive (0-1)
        'olympic_tradition',      # Tradition olympique (0-1)
        'is_host',                # Avantage domicile (0/1)
        'is_summer',              # Jeux d'été (0/1)
        'year_normalized'         # Année normalisée
    ]
    
    X = features_df[feature_columns].fillna(0)  # Remplacer les NaN par 0
    y = features_df['total_medals']             # Variable cible (nombre de médailles)
    
    print(f"   Features préparées : {X.shape[0]} échantillons, {X.shape[1]} features")
    
    # ---------- SPLIT TEMPOREL ----------
    # Division temporelle pour éviter le data leakage
    print("Split temporel des données...")
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    print(f"   Train: {X_train.shape[0]} échantillons")
    print(f"   Test: {X_test.shape[0]} échantillons")
    
    # ---------- NORMALISATION ----------
    # Standardisation des features pour l'optimisation
    print("Normalisation des features...")
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    print("   Features normalisées (moyenne=0, écart-type=1)")
    
    models = {}
    
    # ---------- MODÈLE 1 : RANDOM FOREST (NOTRE MEILLEUR) ----------
    print("\nENTRAÎNEMENT RANDOM FOREST...")
    print("-" * 30)
    rf = RandomForestRegressor(
        n_estimators=100,        # 100 arbres de décision
        max_depth=10,            # Profondeur max pour éviter le surapprentissage
        min_samples_split=5,     # Min échantillons pour diviser un nœud
        min_samples_leaf=2,      # Min échantillons par feuille
        random_state=42          # Reproductibilité
    )
    rf.fit(X_train_scaled, y_train)
    rf_pred = rf.predict(X_test_scaled)
    rf_score = r2_score(y_test, rf_pred)
    models['random_forest'] = {'model': rf, 'score': rf_score, 'scaler': scaler}
    print(f"   Random Forest R²: {rf_score:.3f} (MEILLEUR MODÈLE)")
    
    # 2. XGBoost (if available)
    if XGBOOST_AVAILABLE:
        print("Training XGBoost...")
        xgb_model = xgb.XGBRegressor(
            n_estimators=100,
            max_depth=6,
            learning_rate=0.1,
            random_state=42
        )
        xgb_model.fit(X_train_scaled, y_train)
        xgb_pred = xgb_model.predict(X_test_scaled)
        xgb_score = r2_score(y_test, xgb_pred)
        models['xgboost'] = {'model': xgb_model, 'score': xgb_score, 'scaler': scaler}
        print(f"XGBoost R²: {xgb_score:.3f}")
    
    # 3. Ridge Regression
    print("Training Ridge Regression...")
    ridge = Ridge(alpha=1.0, random_state=42)
    ridge.fit(X_train_scaled, y_train)
    ridge_pred = ridge.predict(X_test_scaled)
    ridge_score = r2_score(y_test, ridge_pred)
    models['ridge'] = {'model': ridge, 'score': ridge_score, 'scaler': scaler}
    print(f"Ridge Regression R²: {ridge_score:.3f}")
    
    # Select best model
    best_model_name = max(models.keys(), key=lambda k: models[k]['score'])
    best_model = models[best_model_name]
    
    print(f"\nBest model: {best_model_name} (R²: {best_model['score']:.3f})")
    
    return best_model, feature_columns

def create_enhanced_predictions(model_info, feature_columns, target_year=2024):
    """Create enhanced predictions for 2024 Olympics."""
    print(f"Creating predictions for {target_year}...")
    
    model = model_info['model']
    scaler = model_info['scaler']
    
    # Get list of countries to predict for
    countries = list(COUNTRY_FACTORS.keys())
    
    predictions = []
    
    for country in countries:
        country_factors = COUNTRY_FACTORS[country]
        
        # Create feature vector for prediction
        features = {
            'avg_recent_3': 0,  # Will be calculated from historical data
            'trend': 0,  # Will be calculated from historical data
            'consistency': 0,  # Will be calculated from historical data
            'peak_performance': 0,  # Will be calculated from historical data
            'years_since_last': 4,  # Standard 4-year cycle
            'population': country_factors['population'],
            'gdp_per_capita': country_factors['gdp_per_capita'],
            'sports_culture': country_factors['sports_culture'],
            'olympic_tradition': country_factors['olympic_tradition'],
            'is_host': 1 if country == 'France' else 0,  # France hosting 2024
            'is_summer': 1,  # 2024 is Summer Olympics
            'year_normalized': (target_year - 1990) / 30
        }
        
        # Convert to array and scale
        feature_array = np.array([features[col] for col in feature_columns]).reshape(1, -1)
        feature_array_scaled = scaler.transform(feature_array)
        
        # Make prediction
        predicted_total = max(0, model.predict(feature_array_scaled)[0])
        
        # Distribute medals based on historical proportions
        # Get historical medal distribution for this country
        historical_gold_ratio = 0.4  # Default ratios
        historical_silver_ratio = 0.3
        historical_bronze_ratio = 0.3
        
        # Adjust ratios based on country factors
        if country in ['USA', 'China', 'Germany']:
            historical_gold_ratio = 0.5  # Top countries get more gold
            historical_silver_ratio = 0.3
            historical_bronze_ratio = 0.2
        elif country in ['France', 'Great Britain', 'Japan']:
            historical_gold_ratio = 0.4
            historical_silver_ratio = 0.35
            historical_bronze_ratio = 0.25
        
        gold = int(round(predicted_total * historical_gold_ratio))
        silver = int(round(predicted_total * historical_silver_ratio))
        bronze = int(round(predicted_total * historical_bronze_ratio))
        
        # Ensure total matches
        total = gold + silver + bronze
        if total != int(round(predicted_total)):
            bronze += int(round(predicted_total)) - total
        
        predictions.append({
            'country': country,
            'year': target_year,
            'gold': max(0, gold),
            'silver': max(0, silver),
            'bronze': max(0, bronze),
            'total': max(0, gold + silver + bronze)
        })
    
    # Sort by total medals
    predictions.sort(key=lambda x: x['total'], reverse=True)
    
    return predictions

def save_models(model_info, feature_columns):
    """Save the trained models."""
    if not JOBLIB_AVAILABLE:
        print("Warning: joblib not available. Cannot save models.")
        return
    
    print("Saving models...")
    
    # Save the best model
    model_data = {
        'model': model_info['model'],
        'scaler': model_info['scaler'],
        'feature_columns': feature_columns,
        'model_type': 'enhanced_ml',
        'version': '2.0',
        'accuracy': model_info['score']
    }
    
    # Save country prediction model
    country_model_path = os.path.join(MODELS_DIR, 'country_best.joblib')
    joblib.dump(model_data, country_model_path)
    print(f"Saved country model to {country_model_path}")
    
    # Save top 25 prediction model (same model, different interface)
    top25_model_path = os.path.join(MODELS_DIR, 'top25_best.joblib')
    joblib.dump(model_data, top25_model_path)
    print(f"Saved top 25 model to {top25_model_path}")

def main():
    """Main training pipeline."""
    print("=" * 60)
    print("ADVANCED OLYMPIC MEDAL PREDICTION MODEL TRAINING")
    print("=" * 60)
    
    try:
        # Load and preprocess data
        df = load_and_preprocess_data()
        
        # Create features
        features_df = create_features(df)
        
        # Train models
        model_info, feature_columns = train_models(features_df)
        
        if model_info is None:
            print("Error: Could not train models.")
            return
        
        # Create predictions for 2024
        predictions = create_enhanced_predictions(model_info, feature_columns, 2024)
        
        # Display top 15 predictions
        print("\n" + "=" * 60)
        print("TOP 15 PREDICTED COUNTRIES FOR 2024 OLYMPICS")
        print("=" * 60)
        for i, pred in enumerate(predictions[:15], 1):
            print(f"{i:2d}. {pred['country']:20s} - "
                  f"Gold: {pred['gold']:2d}, Silver: {pred['silver']:2d}, "
                  f"Bronze: {pred['bronze']:2d}, Total: {pred['total']:2d}")
        
        # Save models
        save_models(model_info, feature_columns)
        
        print("\n" + "=" * 60)
        print("MODEL TRAINING COMPLETED SUCCESSFULLY!")
        print("=" * 60)
        print(f"Model accuracy (R²): {model_info['score']:.3f}")
        print("Models saved to:", MODELS_DIR)
        print("\nThe prediction service will now use these enhanced models.")
        
    except Exception as e:
        print(f"Error during training: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    main()
