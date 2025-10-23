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
    """Récupérer les données des villes hôtes avec filtres et pagination"""
    # Récupérer les paramètres de la requête
    page = request.args.get('page', 1, type=int)
    limit = request.args.get('limit', 20, type=int)
    search = request.args.get('search', '')
    sort_by = request.args.get('sort_by', '')
    sort_order = request.args.get('sort_order', 'asc')
    
    # Récupérer les filtres
    filters = {}
    for key in ['country', 'year', 'season']:
        value = request.args.get(key)
        if value:
            filters[key] = value
    
    # Filtres de plage pour l'année
    year_min = request.args.get('year_min')
    year_max = request.args.get('year_max')
    if year_min:
        filters['year_min'] = int(year_min)
    if year_max:
        filters['year_max'] = int(year_max)
    
    result = HostService.get_hosts(
        page=page,
        limit=limit,
        search=search,
        sort_by=sort_by,
        sort_order=sort_order,
        filters=filters
    )
    
    if result['status'] == 'error':
        return jsonify({
            **result,
            'timestamp': datetime.now().isoformat()
        }), 500
    
    return jsonify({
        **result,
        'timestamp': datetime.now().isoformat()
    })

@host_bp.route('/hosts/ranking')
def get_hosts_ranking():
    """Récupérer le classement des pays organisateurs de JO"""
    result = HostService.get_hosts_ranking()
    
    if result['status'] == 'error':
        return jsonify({
            **result,
            'timestamp': datetime.now().isoformat()
        }), 500
    
    return jsonify({
        **result,
        'timestamp': datetime.now().isoformat()
    })
