import os
from supabase import create_client, Client
from dotenv import load_dotenv

# Charger les variables d'environnement
load_dotenv('config.env')

# Configuration Supabase
SUPABASE_URL = os.getenv('SUPABASE_URL', 'https://xecsougqsdyrrzscmtgn.supabase.co')
SUPABASE_KEY = os.getenv('SUPABASE_KEY')

if not SUPABASE_KEY:
    print('SUPABASE_KEY environment variable is required!')
    print('Please create a .env file with your Supabase key')
    exit(1)

# Créer le client Supabase
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

def get_supabase_client() -> Client:
    """Retourne le client Supabase configuré"""
    return supabase

def test_connection() -> bool:
    """Teste la connexion à la base de données Supabase"""
    try:
        # Test de connexion avec la table athlete
        result = supabase.table('athlete').select('*').limit(1).execute()
        
        if result.data is not None:
            print('Connexion Supabase reussie!')
            return True
        else:
            print('Erreur de connexion Supabase: Aucune donnee retournee')
            return False
            
    except Exception as error:
        print(f'Erreur lors du test de connexion: {error}')
        return False

def get_athletes(limit: int = 100):
    """Récupère les athlètes depuis la base de données"""
    try:
        result = supabase.table('athlete').select('*').execute()
        return result.data
    except Exception as error:
        print(f'Erreur lors de la récupération des athlètes: {error}')
        return None

def get_medals(limit: int = 100):
    """Récupère les médailles depuis la base de données"""
    try:
        result = supabase.table('medal_awards').select('*').execute()
        return result.data
    except Exception as error:
        print(f'Erreur lors de la récupération des médailles: {error}')
        return None

def get_hosts(limit: int = 100):
    """Récupère les données des villes hôtes depuis la base de données"""
    try:
        result = supabase.table('hosts').select('*').execute()
        return result.data
    except Exception as error:
        print(f'Erreur lors de la récupération des données hosts: {error}')
        return None