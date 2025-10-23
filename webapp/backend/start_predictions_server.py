#!/usr/bin/env python3
"""
Script de démarrage pour le serveur de prédictions
"""
import os
import sys
from app import create_app

def main():
    """Démarre le serveur Flask avec les routes de prédiction"""
    print("🚀 Démarrage du serveur de prédictions olympiques...")
    
    # Créer l'application
    app = create_app()
    
    # Configuration
    port = int(os.getenv('PORT', 5000))
    debug = os.getenv('FLASK_DEBUG', 'True').lower() == 'true'
    
    print(f"📡 Serveur démarré sur http://localhost:{port}")
    print(f"🔧 Mode debug: {debug}")
    print("📋 Routes de prédiction disponibles:")
    print("  - /api/predictions/country/<country>")
    print("  - /api/predictions/top-countries") 
    print("  - /api/predictions/athletes")
    print("  - /api/predictions/sports")
    print("  - /api/predictions/models/status")
    print("\n✅ Serveur prêt ! Appuyez sur Ctrl+C pour arrêter.")
    
    # Démarrer le serveur
    app.run(host='0.0.0.0', port=port, debug=debug)

if __name__ == '__main__':
    main()
