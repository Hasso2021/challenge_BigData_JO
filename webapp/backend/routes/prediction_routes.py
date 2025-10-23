"""
Routes pour les prédictions de médailles olympiques
"""
from flask import Blueprint, request, jsonify
from services.prediction_service import PredictionService

prediction_bp = Blueprint('prediction', __name__, url_prefix='/api/predictions')

@prediction_bp.route('/country/<country>', methods=['GET'])
def predict_country_medals(country):
    """
    Prédire les médailles pour un pays spécifique
    Query params: year (int), model (str: 'ma' ou 'es')
    """
    try:
        year = request.args.get('year', 2024, type=int)
        model = request.args.get('model', 'ma')
        
        result = PredictionService.predict_country_medals(
            country=country, 
            year=year, 
            model=model
        )
        
        return jsonify({
            'success': True,
            'data': result,
            'metadata': {
                'country': country,
                'year': year,
                'model': model
            }
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@prediction_bp.route('/top-countries', methods=['GET'])
def predict_top_countries():
    """
    Prédire le top des pays par médailles
    Query params: top_n (int), year (int), model (str)
    """
    try:
        top_n = request.args.get('top_n', 25, type=int)
        year = request.args.get('year', 2024, type=int)
        model = request.args.get('model', 'ma')
        
        results = PredictionService.predict_top_countries(
            top_n=top_n,
            year=year,
            model=model
        )
        
        return jsonify({
            'success': True,
            'data': results,
            'metadata': {
                'top_n': top_n,
                'year': year,
                'model': model,
                'count': len(results)
            }
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@prediction_bp.route('/athletes', methods=['GET'])
def predict_athlete_medals():
    """
    Prédire les performances des athlètes
    Query params: limit (int), model (str)
    """
    try:
        limit = request.args.get('limit', 50, type=int)
        model = request.args.get('model', 'best')
        
        results = PredictionService.predict_athlete_medals(
            limit=limit,
            model=model
        )
        
        return jsonify({
            'success': True,
            'data': results,
            'metadata': {
                'limit': limit,
                'model': model,
                'count': len(results)
            }
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@prediction_bp.route('/sports', methods=['GET'])
def predict_sport_performance():
    """
    Prédire les performances par sport
    Query params: sport (str), year (int), limit (int)
    """
    try:
        sport = request.args.get('sport', '')
        year = request.args.get('year', 2024, type=int)
        limit = request.args.get('limit', 20, type=int)
        
        # Pour l'instant, utilisons les données historiques par sport
        # TODO: Implémenter un modèle spécifique pour les sports
        from services.prediction_service import _safe_read_csv, DATA_DIR
        import pandas as pd
        
        df = _safe_read_csv(f"{DATA_DIR}/olympic_medals_clean_v2.csv")
        if df is None:
            return jsonify({
                'success': False,
                'error': 'Données non disponibles'
            }), 500
        
        # Filtrer par sport si spécifié
        if sport:
            df = df[df['sport'].str.contains(sport, case=False, na=False)]
        
        # Grouper par sport et calculer les moyennes
        sport_stats = df.groupby('sport').agg({
            'gold': 'mean',
            'silver': 'mean', 
            'bronze': 'mean'
        }).round(1)
        
        sport_stats['total'] = sport_stats['gold'] + sport_stats['silver'] + sport_stats['bronze']
        sport_stats = sport_stats.sort_values('total', ascending=False).head(limit)
        
        results = []
        for sport_name, row in sport_stats.iterrows():
            results.append({
                'sport': sport_name,
                'gold': int(row['gold']),
                'silver': int(row['silver']),
                'bronze': int(row['bronze']),
                'total': int(row['total'])
            })
        
        return jsonify({
            'success': True,
            'data': results,
            'metadata': {
                'sport_filter': sport,
                'year': year,
                'limit': limit,
                'count': len(results)
            }
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@prediction_bp.route('/models/status', methods=['GET'])
def get_models_status():
    """
    Obtenir le statut des modèles entraînés
    """
    try:
        from services.prediction_service import PredictionService
        import os
        
        models_dir = os.path.join(os.path.dirname(__file__), '..', '..', '..', 'models')
        models_status = {}
        
        model_files = [
            'country_best.joblib',
            'country_second.joblib', 
            'top25_best.joblib',
            'top25_second.joblib',
            'athletes_quick.joblib',
            'athletes_quick_second.joblib'
        ]
        
        for model_file in model_files:
            model_path = os.path.join(models_dir, model_file)
            models_status[model_file] = {
                'exists': os.path.exists(model_path),
                'size': os.path.getsize(model_path) if os.path.exists(model_path) else 0
            }
        
        return jsonify({
            'success': True,
            'data': models_status
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500
