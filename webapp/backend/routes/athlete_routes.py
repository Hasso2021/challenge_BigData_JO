"""
Routes pour les opérations liées aux athlètes
"""
from flask import Blueprint, jsonify, request
from services.athlete_service import AthleteService

# Créer un Blueprint pour les routes des athlètes
athlete_bp = Blueprint('athletes', __name__, url_prefix='/api')

@athlete_bp.route('/athletes')
def get_athletes():
    """Récupérer la liste des athlètes"""
    # Récupérer le paramètre limit depuis la query string
    limit = request.args.get('limit', 10, type=int)
    
    result = AthleteService.get_athletes(limit)
    
    if result['status'] == 'error':
        return jsonify(result), 500
    
    return jsonify(result)
