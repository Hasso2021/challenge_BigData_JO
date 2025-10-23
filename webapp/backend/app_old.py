from flask import Flask, jsonify, request
from flask_cors import CORS
import os
from datetime import datetime
from dotenv import load_dotenv
from database.supabase_client import test_connection, get_supabase_client, get_hosts

# Charger les variables d'environnement
load_dotenv('config.env')

# Créer l'application Flask
app = Flask(__name__)
CORS(app)

# Configuration
app.config['DEBUG'] = os.getenv('FLASK_DEBUG', 'True').lower() == 'true'
app.config['PORT'] = int(os.getenv('PORT', 5000))

@app.route('/')
def home():
    """Route de base"""
    return jsonify({
        'message': 'API Olympic Prediction Backend',
        'version': '1.0.0',
        'framework': 'Flask',
        'endpoints': {
            'health': '/api/health',
            'athletes': '/api/athletes',
            'medals': '/api/medals',
            'm_award': '/api/m_award',
            'hosts': '/api/hosts',
            'test': '/api/test',
            'olympic_results': '/api/olympic_results'
        }
    })

@app.route('/api/health')
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

@app.route('/api/athletes')
def get_athletes():
    """Récupérer la liste des athlètes"""
    try:
        supabase = get_supabase_client()
        result = supabase.table('athlete').select('*').execute()
        
        return jsonify({
            'status': 'success',
            'data': result.data,
            'count': len(result.data)
        })
    except Exception as error:
        return jsonify({
            'status': 'error',
            'message': str(error)
        }), 500

@app.route('/api/olympic_results')
def get_olympic_results():
    """Récupérer la liste des athlètes"""
    try:
        supabase = get_supabase_client()
        result = supabase.table('olympic_results').select('*').execute()
        
        return jsonify({
            'status': 'success',
            'data': result.data,
            'count': len(result.data)
        })
    except Exception as error:
        return jsonify({
            'status': 'error',
            'message': str(error)
        }), 500

@app.route('/api/m_award')
def get_m_award():
    """Récupérer les données de médailles"""
    try:
        supabase = get_supabase_client()
        result = supabase.table('m_award').select('*').execute()
        
        return jsonify({
            'status': 'success',
            'data': result.data,
            'count': len(result.data)
        })
    except Exception as error:
        return jsonify({
            'status': 'error',
            'message': str(error)
        }), 500


@app.route('/api/medals')
def get_medals():
    """Récupérer les données de médailles"""
    try:
        supabase = get_supabase_client()
        result = supabase.table('medals').select('*').execute()
        
        return jsonify({
            'status': 'success',
            'data': result.data,
            'count': len(result.data)
        })
    except Exception as error:
        return jsonify({
            'status': 'error',
            'message': str(error)
        }), 500

@app.route('/api/hosts')
def get_hosts_data():
    """Récupérer les données des villes hôtes des Jeux Olympiques"""
    try:
        supabase = get_supabase_client()
        result = supabase.table('hosts').select('*').limit(50).execute()
        
        return jsonify({
            'status': 'success',
            'data': result.data,
            'count': len(result.data),
            'timestamp': datetime.now().isoformat()
        })
    except Exception as error:
        return jsonify({
            'status': 'error',
            'message': str(error),
            'timestamp': datetime.now().isoformat()
        }), 500

@app.route('/api/test')
def test_endpoint():
    """Endpoint de test simple"""
    return jsonify({
        'message': 'Test endpoint fonctionne!',
        'server': 'Flask',
        'timestamp': datetime.now().isoformat()
    })

if __name__ == '__main__':
    print("=" * 50)
    print("DEMARRAGE DU SERVEUR FLASK")
    print("=" * 50)
    print(f"Port: {app.config['PORT']}")
    print(f"Debug: {app.config['DEBUG']}")
    print(f"URL: http://localhost:{app.config['PORT']}")
    print("=" * 50)
    
    # Tester la connexion au démarrage
    print("Test de connexion Supabase...")
    if test_connection():
        print("Connexion Supabase etablie avec succes!")
    else:
        print("Echec de la connexion Supabase")
    
    print("=" * 50)
    print("SERVEUR DEMARRE - Pret a recevoir des requetes")
    print("=" * 50)
    
    try:
        app.run(
            host='127.0.0.1',
            port=app.config['PORT'],
            debug=app.config['DEBUG']
        )
    except Exception as e:
        print(f"Erreur lors du demarrage: {e}")
        print("Verifiez que le port n'est pas deja utilise")
