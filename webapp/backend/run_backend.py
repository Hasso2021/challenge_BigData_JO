#!/usr/bin/env python3
"""
Script simple pour démarrer le serveur Flask
"""
import os
import sys
from pathlib import Path

# Ajouter le répertoire backend au path Python
backend_dir = Path(__file__).parent
sys.path.insert(0, str(backend_dir))

# Changer vers le répertoire backend
os.chdir(backend_dir)

try:
    from app import main
    print("🚀 Démarrage du serveur Flask...")
    main()
except ImportError as e:
    print(f"❌ Erreur d'import: {e}")
    print("💡 Assurez-vous d'installer les dépendances: pip install -r requirements.txt")
    sys.exit(1)
except Exception as e:
    print(f"❌ Erreur: {e}")
    sys.exit(1)
