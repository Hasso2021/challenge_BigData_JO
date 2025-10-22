"""
Routes pour les opérations liées aux villes hôtes
"""
from flask import Blueprint, jsonify, request
from services.host_service import HostService
from datetime import datetime

# Créer un Blueprint pour les routes des villes hôtes
host_bp = Blueprint('hosts', __name__, url_prefix='/api')

@host_bp.route('/hosts')
def get_hosts():
    """Récupérer les données des villes hôtes des Jeux Olympiques"""
    limit = request.args.get('limit', 50, type=int)
    
    result = HostService.get_hosts(limit)
    
    if result['status'] == 'error':
        return jsonify({
            **result,
            'timestamp': datetime.now().isoformat()
        }), 500
    
    return jsonify({
        **result,
        'timestamp': datetime.now().isoformat()
    })
