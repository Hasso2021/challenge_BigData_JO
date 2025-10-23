"""
Routes pour les opérations liées aux médailles
"""
from flask import Blueprint, jsonify, request
from services.medal_service import MedalService

# Créer un Blueprint pour les routes des médailles
medal_bp = Blueprint('medals', __name__, url_prefix='/api')

@medal_bp.route('/medals')
def get_medals():
    """Récupérer les données de médailles avec filtres et pagination"""
    # Récupérer les paramètres de la requête
    page = request.args.get('page', 1, type=int)
    limit = request.args.get('limit', type=int)  # Pas de limite par défaut
    search = request.args.get('search', '')
    sort_by = request.args.get('sort_by', '')
    sort_order = request.args.get('sort_order', 'asc')
    
    # Récupérer les filtres
    filters = {}
    for key in ['country', 'medal_type', 'year', 'sport']:
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
    
    result = MedalService.get_medals(
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

@medal_bp.route('/rewards')
def get_rewards():
    """Récupérer les données de récompenses (table medals)"""
    result = MedalService.get_rewards()
    
    if result['status'] == 'error':
        return jsonify(result), 500
    
    return jsonify(result)

@medal_bp.route('/medals/france')
def get_france_medals():
    """Récupérer les médailles de la France depuis le début des JO"""
    result = MedalService.get_france_medals()
    
    if result['status'] == 'error':
        return jsonify(result), 500
    
    return jsonify(result)

@medal_bp.route('/medals/france/success')
def get_france_success():
    """Analyser les succès de la France par édition des JO"""
    result = MedalService.get_france_success_by_edition()
    
    if result['status'] == 'error':
        return jsonify(result), 500
    
    return jsonify(result)

@medal_bp.route('/medals/france/sports')
def get_france_sports():
    """Analyser les spécialités sportives de la France"""
    result = MedalService.get_france_sport_specialties()
    
    if result['status'] == 'error':
        return jsonify(result), 500
    
    return jsonify(result)

@medal_bp.route('/medals/dominant-sports')
def get_dominant_sports():
    """Analyser l'évolution des sports dominants au fil des ans"""
    result = MedalService.get_dominant_sports_evolution()
    
    if result['status'] == 'error':
        return jsonify(result), 500
    
    return jsonify(result)

@medal_bp.route('/medals/country-performance')
def get_country_performance():
    """Analyser les performances par pays - classement global et comparaisons"""
    result = MedalService.get_country_performance_analysis()
    
    if result['status'] == 'error':
        return jsonify(result), 500
    
    return jsonify(result)

@medal_bp.route('/medals/temporal-trends')
def get_temporal_trends():
    """Analyser les tendances temporelles des performances olympiques"""
    result = MedalService.get_temporal_trends_analysis()
    
    if result['status'] == 'error':
        return jsonify(result), 500
    
    return jsonify(result)

@medal_bp.route('/medals/success-factors')
def get_success_factors():
    """Analyser les facteurs de succès olympiques"""
    result = MedalService.get_success_factors_analysis()
    
    if result['status'] == 'error':
        return jsonify(result), 500
    
    return jsonify(result)