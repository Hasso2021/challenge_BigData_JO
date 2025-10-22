# Dossier Tests

Ce dossier contient tous les fichiers de test et de configuration pour vérifier les connexions et la configuration du backend.

## Fichiers inclus :

- **setup_supabase.py** : Script pour configurer et tester la connexion à Supabase
- **test_flask_connection.py** : Test de connexion Flask avec Supabase
- **test_flask_only.py** : Test de connexion Flask uniquement
- **verify_flask_setup.py** : Vérification de la configuration Flask

## Utilisation :

Pour exécuter les tests, naviguez vers le dossier backend et lancez les scripts :

```bash
cd webapp/backend
python tests/setup_supabase.py
python tests/test_flask_connection.py
python tests/test_flask_only.py
python tests/verify_flask_setup.py
python tests/test_hosts_endpoint.py
```

**Note importante :** Le serveur Flask fonctionne maintenant sur le port 3000.

## Note :

Ces fichiers sont des utilitaires de développement et ne sont pas nécessaires pour le fonctionnement de l'application en production.
