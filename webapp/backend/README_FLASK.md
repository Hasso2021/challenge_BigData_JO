# 🐍 Backend Flask - Olympic Prediction 2026

## 📋 Description
Backend API développé avec Flask pour l'application Olympic Prediction 2026, connecté à Supabase.

> **Note** : Ce backend a été migré de Node.js/Express vers Flask pour une meilleure intégration avec les outils Python de data science.

## 🚀 Installation et Configuration

### 1. Installer les dépendances Python
```bash
pip install -r requirements.txt
```

### 2. Configuration des variables d'environnement
Créez un fichier `.env` dans le dossier `backend/` :
```env
SUPABASE_URL=https://xecsougqsdyrrzscmtgn.supabase.co
SUPABASE_KEY=votre_cle_supabase_ici
FLASK_DEBUG=True
PORT=5000
```

### 3. Tester la connexion
```bash
python test_flask_connection.py
```

### 4. Démarrer le serveur
```bash
python app.py
```

## 📡 Endpoints API

### Base
- `GET /` - Informations sur l'API

### Santé
- `GET /api/health` - Vérification de l'état de l'API et de la base de données

### Données
- `GET /api/athletes` - Liste des athlètes (limite 10)
- `GET /api/medals` - Données de médailles (limite 10)

## 🔧 Structure du projet
```
backend/
├── app.py                    # Application Flask principale
├── requirements.txt          # Dépendances Python
├── test_flask_connection.py  # Script de test
├── env_example.txt          # Exemple de configuration
├── README_FLASK.md          # Documentation Flask
└── database/
    ├── supabase_client.py   # Client Supabase Python
    └── README.md            # Documentation base de données
```

## 🐛 Dépannage

### Erreur de connexion Supabase
1. Vérifiez que votre clé Supabase est correcte
2. Assurez-vous que le fichier `.env` existe
3. Vérifiez que les tables `athlete` et `medal_awards` existent dans Supabase

### Erreur de dépendances
```bash
pip install --upgrade pip
pip install -r requirements.txt
```

## 🌐 Accès
- **URL locale** : http://localhost:5000
- **API Health** : http://localhost:5000/api/health
