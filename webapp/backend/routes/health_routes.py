"""
Routes pour la vérification de l'état de l'API
"""
from flask import Blueprint, jsonify
from database.supabase_client import test_connection
from datetime import datetime

# Créer un Blueprint pour les routes de santé
health_bp = Blueprint('health', __name__, url_prefix='/api')

@health_bp.route('/health')
def health_check():
    """Vérification de l'état de l'API et de la base de données"""
    try:
        is_connected = test_connection()
        return jsonify({
            'status': 'OK',
            'database': 'Connected' if is_connected else 'Disconnected',
            'framework': 'Flask',
            'timestamp': datetime.now().isoformat()
        })
    except Exception as error:
        return jsonify({
            'status': 'Error',
            'message': str(error),
            'framework': 'Flask',
            'timestamp': datetime.now().isoformat()
        }), 500

@health_bp.route('/test')
def test_endpoint():
    """Endpoint de test simple"""
    return jsonify({
        'message': 'Test endpoint fonctionne!',
        'server': 'Flask',
        'timestamp': datetime.now().isoformat()
    })
