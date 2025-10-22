"""
Routes pour les opérations liées aux résultats olympiques
"""
from flask import Blueprint, jsonify, request
from services.olympic_results_service import OlympicResultsService

# Créer un Blueprint pour les routes des résultats olympiques
olympic_results_bp = Blueprint('olympic_results', __name__, url_prefix='/api')

@olympic_results_bp.route('/olympic_results')
def get_olympic_results():
    """Récupérer les résultats olympiques"""
    limit = request.args.get('limit', 10, type=int)
    
    result = OlympicResultsService.get_olympic_results(limit)
    
    if result['status'] == 'error':
        return jsonify(result), 500
    
    return jsonify(result)
