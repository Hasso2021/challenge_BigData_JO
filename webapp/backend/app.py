"""
Application Flask principale pour l'API Olympic Prediction
Structure organisée avec séparation des routes et services
"""
from flask import Flask, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv
from database.supabase_client import test_connection

# Importer les routes
from routes.athlete_routes import athlete_bp
from routes.medal_routes import medal_bp
from routes.host_routes import host_bp
from routes.olympic_results_routes import olympic_results_bp
from routes.health_routes import health_bp
from routes.gdp_analysis_routes import gdp_analysis_bp
from routes.prediction_routes import prediction_bp

# Charger les variables d'environnement
load_dotenv('config.env')

def create_app():
    """Factory function pour créer l'application Flask"""
    # Créer l'application Flask
    app = Flask(__name__)
    CORS(app)

    # Configuration
    app.config['DEBUG'] = os.getenv('FLASK_DEBUG', 'True').lower() == 'true'
    app.config['PORT'] = int(os.getenv('PORT', 5000))

    # Enregistrer les Blueprints
    app.register_blueprint(athlete_bp)
    app.register_blueprint(medal_bp)
    app.register_blueprint(host_bp)
    app.register_blueprint(olympic_results_bp)
    app.register_blueprint(health_bp)
    app.register_blueprint(gdp_analysis_bp, url_prefix='/api/gdp-analysis')
    app.register_blueprint(prediction_bp)

    # Route de base
    @app.route('/')
    def home():
        """Route de base avec documentation des endpoints"""
        return jsonify({
            'message': 'API Olympic Prediction Backend',
            'version': '2.0.0',
            'framework': 'Flask',
            'architecture': 'Modular (Routes + Services)',
            'endpoints': {
                'health': '/api/health',
                'test': '/api/test',
                'athletes': '/api/athletes',
                'medals': '/api/medals',
                'rewards': '/api/rewards',
                'hosts': '/api/hosts',
                'olympic_results': '/api/olympic_results',
                'gdp_analysis': '/api/gdp-analysis'
            },
            'parameters': {
                'limit': 'Query parameter pour limiter les résultats (ex: ?limit=20)'
            }
        })

    return app

def main():
    """Fonction principale pour démarrer le serveur"""
    app = create_app()
    
    print("=" * 60)
    print("DEMARRAGE DU SERVEUR FLASK - VERSION ORGANISEE")
    print("=" * 60)
    print(f"Port: {app.config['PORT']}")
    print(f"Debug: {app.config['DEBUG']}")
    print(f"URL: http://localhost:{app.config['PORT']}")
    print("=" * 60)
    
    # Tester la connexion au démarrage
    print("Test de connexion Supabase...")
    if test_connection():
        print("Connexion Supabase etablie avec succes!")
    else:
        print("Echec de la connexion Supabase")
    
    # print("=" * 60)
    # print("🎯 SERVEUR DEMARRE - Prêt à recevoir des requêtes")
    # print("📋 Endpoints disponibles:")
    # print("   • GET  /                    - Documentation API")
    # print("   • GET  /api/health          - État de l'API")
    # print("   • GET  /api/test            - Test simple")
    # print("   • GET  /api/athletes        - Liste des athlètes")
    # print("   • GET  /api/medals          - Médailles (m_award)")
    # print("   • GET  /api/rewards         - Récompenses (medals)")
    # print("   • GET  /api/hosts           - Villes hôtes")
    # print("   • GET  /api/olympic_results - Résultats olympiques")
    # print("=" * 60)
    
    try:
        app.run(
            host='127.0.0.1',
            port=app.config['PORT'],
            debug=app.config['DEBUG']
        )
    except Exception as e:
        print(f"Erreur lors du demarrage: {e}")
        print("Verifiez que le port n'est pas deja utilise")

if __name__ == '__main__':
    main()
