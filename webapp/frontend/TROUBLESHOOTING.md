# Guide de Dépannage - Frontend React

## Problème : Aucune donnée ne s'affiche

### 🔍 Diagnostic Rapide

1. **Vérifier la Console du Navigateur**
   - Ouvrir DevTools (F12)
   - Aller dans l'onglet Console
   - Chercher les erreurs en rouge

2. **Tester la Connexion Backend**
   - Cliquer sur le bouton "🔍 Test Connexion" dans le DataViewer
   - Vérifier les messages dans la console

### 🛠️ Solutions par Problème

#### 1. Backend Flask non démarré

**Symptômes :**
- Erreur "Network Error" ou "Failed to fetch"
- Message "Backend non accessible"

**Solution :**
```bash
# Démarrer le backend Flask
cd webapp/backend
python app.py
```

**Vérification :**
- Aller sur `http://localhost:5000/api/athletes?limit=5`
- Doit afficher du JSON

#### 2. Problème de CORS

**Symptômes :**
- Erreur "CORS policy" dans la console
- Requêtes bloquées

**Solution :**
Vérifier que le backend Flask a CORS configuré :
```python
from flask_cors import CORS
CORS(app)
```

#### 3. Base de données non accessible

**Symptômes :**
- Backend démarre mais erreur 500
- Message "Database connection failed"

**Solution :**
- Vérifier la configuration de la base de données
- Vérifier que les fichiers CSV sont présents
- Vérifier les logs du backend

#### 4. Endpoints incorrects

**Symptômes :**
- Erreur 404 "Not Found"
- Aucune donnée retournée

**Solution :**
Vérifier que les routes sont enregistrées dans `app.py` :
```python
from routes.athlete_routes import athlete_bp
from routes.medal_routes import medal_bp
from routes.olympic_results_routes import olympic_results_bp
from routes.host_routes import host_bp

app.register_blueprint(athlete_bp)
app.register_blueprint(medal_bp)
app.register_blueprint(olympic_results_bp)
app.register_blueprint(host_bp)
```

### 🧪 Tests de Diagnostic

#### Test 1: Vérifier le Backend
```bash
curl http://localhost:5000/api/athletes?limit=1
```

#### Test 2: Vérifier les Routes
```bash
curl http://localhost:5000/api/medals?limit=1
curl http://localhost:5000/api/olympic_results?limit=1
curl http://localhost:5000/api/hosts?limit=1
```

#### Test 3: Vérifier les Logs Backend
Regarder les logs du serveur Flask pour voir les erreurs.

### 📊 Mode Démonstration

Si le backend n'est pas accessible, l'application utilise des données de démonstration :

- **Athlètes** : 5 athlètes célèbres
- **Médailles** : 5 médailles d'exemple
- **Résultats** : 5 résultats d'exemple
- **Villes Hôtes** : 5 villes hôtes récentes

### 🔧 Configuration Avancée

#### Variables d'Environnement
Créer un fichier `.env` dans `webapp/frontend/` :
```
REACT_APP_API_URL=http://localhost:5000/api
```

#### Proxy de Développement
Dans `package.json`, ajouter :
```json
{
  "proxy": "http://localhost:5000"
}
```

### 📝 Logs Utiles

#### Console Frontend
```javascript
// Tester la connexion
fetch('http://localhost:5000/api/athletes?limit=1')
  .then(response => response.json())
  .then(data => console.log('Backend OK:', data))
  .catch(error => console.log('Backend Error:', error));
```

#### Logs Backend
Vérifier les logs du serveur Flask pour voir :
- Les requêtes reçues
- Les erreurs de base de données
- Les erreurs de configuration

### 🚨 Erreurs Courantes

1. **"Cannot read property 'data' of undefined"**
   - Le backend ne répond pas
   - Vérifier que Flask est démarré

2. **"Network Error"**
   - Problème de CORS
   - Backend non accessible
   - URL incorrecte

3. **"404 Not Found"**
   - Route non enregistrée
   - URL incorrecte
   - Blueprint non importé

4. **"500 Internal Server Error"**
   - Erreur de base de données
   - Fichier CSV manquant
   - Erreur de configuration

### ✅ Vérification Finale

1. Backend Flask démarré sur port 5000
2. Base de données accessible
3. Routes enregistrées
4. CORS configuré
5. Fichiers CSV présents
6. Frontend React sur port 3000
7. Pas d'erreurs dans la console
8. Données s'affichent ou mode démonstration actif
