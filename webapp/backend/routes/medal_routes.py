"""
Routes pour les opérations liées aux médailles
"""
from flask import Blueprint, jsonify, request
from services.medal_service import MedalService

# Créer un Blueprint pour les routes des médailles
medal_bp = Blueprint('medals', __name__, url_prefix='/api')

@medal_bp.route('/medals')
def get_medals():
    """Récupérer les données de médailles (table m_award)"""
    limit = request.args.get('limit', 10, type=int)
    
    result = MedalService.get_medals(limit)
    
    if result['status'] == 'error':
        return jsonify(result), 500
    
    return jsonify(result)

@medal_bp.route('/rewards')
def get_rewards():
    """Récupérer les données de récompenses (table medals)"""
    limit = request.args.get('limit', 10, type=int)
    
    result = MedalService.get_rewards(limit)
    
    if result['status'] == 'error':
        return jsonify(result), 500
    
    return jsonify(result)
