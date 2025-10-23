#!/usr/bin/env python3
"""
Script de démarrage du serveur Flask pour l'API Olympic Prediction
"""
import sys
import os
import subprocess
from pathlib import Path

def check_dependencies():
    """Vérifier que toutes les dépendances sont installées"""
    try:
        import flask
        import flask_cors
        import supabase
        import dotenv
        print("✅ Toutes les dépendances sont installées")
        return True
    except ImportError as e:
        print(f"❌ Dépendance manquante: {e}")
        print("💡 Exécutez: pip install -r requirements.txt")
        return False

def check_config():
    """Vérifier la configuration"""
    config_file = Path("config.env")
    if not config_file.exists():
        print("❌ Fichier config.env manquant")
        print("💡 Créez le fichier config.env avec vos variables d'environnement")
        return False
    
    print("✅ Fichier de configuration trouvé")
    return True

def start_server():
    """Démarrer le serveur Flask"""
    print("🚀 Démarrage du serveur Flask...")
    
    # Vérifier les dépendances
    if not check_dependencies():
        return False
    
    # Vérifier la configuration
    if not check_config():
        return False
    
    # Démarrer le serveur
    try:
        from app import main
        main()
    except Exception as e:
        print(f"❌ Erreur lors du démarrage: {e}")
        return False
    
    return True

if __name__ == "__main__":
    print("=" * 60)
    print("🏃‍♂️ SCRIPT DE DÉMARRAGE - API OLYMPIC PREDICTION")
    print("=" * 60)
    
    # Changer vers le répertoire du backend
    backend_dir = Path(__file__).parent
    os.chdir(backend_dir)
    
    success = start_server()
    
    if not success:
        print("❌ Échec du démarrage du serveur")
        sys.exit(1)
    else:
        print("✅ Serveur démarré avec succès")
