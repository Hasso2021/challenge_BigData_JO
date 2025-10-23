# webapp/backend/routes/predictions_routes.py
from flask import Blueprint, jsonify, request
from services.prediction_service import PredictionService

predictions_bp = Blueprint('predictions', __name__, url_prefix='/api')

@predictions_bp.route('/predictions/country', methods=['GET'])
def predict_country():
    country = request.args.get('country', 'France')
    year    = request.args.get('year', 2024, type=int)
    model   = request.args.get('model', 'ma')   # 'ma' or 'es'
    try:
        result = PredictionService.predict_country_medals(country=country, year=year, model=model)
        return jsonify({'status': 'success', 'predictions': result})
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

@predictions_bp.route('/predictions/top25', methods=['GET'])
def predict_top25():
    top_n = request.args.get('top_n', 25, type=int)
    year  = request.args.get('year', 2024, type=int)
    model = request.args.get('model', 'ma')
    try:
        result = PredictionService.predict_top_countries(top_n=top_n, year=year, model=model)
        return jsonify({'status': 'success', 'predictions': result})
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

@predictions_bp.route('/predictions/athletes', methods=['GET'])
def predict_athletes():
    limit = request.args.get('limit', 50, type=int)
    try:
        result = PredictionService.predict_athlete_medals(limit=limit)
        return jsonify({'status': 'success', 'predictions': result})
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500
