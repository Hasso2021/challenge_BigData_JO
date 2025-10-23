"""
Routes pour les opérations liées aux résultats olympiques
"""
from flask import Blueprint, jsonify, request
from services.olympic_results_service import OlympicResultsService

# Créer un Blueprint pour les routes des résultats olympiques
olympic_results_bp = Blueprint('olympic_results', __name__, url_prefix='/api')

@olympic_results_bp.route('/olympic_results')
def get_olympic_results():
    """Récupérer les résultats olympiques avec filtres et pagination"""
    # Récupérer les paramètres de la requête
    page = request.args.get('page', 1, type=int)
    limit = request.args.get('limit', 20, type=int)
    search = request.args.get('search', '')
    sort_by = request.args.get('sort_by', '')
    sort_order = request.args.get('sort_order', 'asc')
    
    # Récupérer les filtres
    filters = {}
    for key in ['country', 'sport', 'year', 'season']:
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
    
    result = OlympicResultsService.get_olympic_results(
        page=page,
        limit=limit,
        search=search,
        sort_by=sort_by,
        sort_order=sort_order,
        filters=filters
    )
    
    if result['status'] == 'error':
        return jsonify(result), 500
    
    return jsonify(result)
