# Script PowerShell pour démarrer les services Olympic Data Hub
Write-Host "🚀 Démarrage des services Olympic Data Hub..." -ForegroundColor Green

# Démarrer le backend Flask
Write-Host "📡 Démarrage du backend Flask..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd webapp/backend; python run_backend.py"

# Attendre un peu pour que le backend démarre
Start-Sleep -Seconds 3

# Démarrer le frontend React
Write-Host "🌐 Démarrage du frontend React..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd webapp/frontend; npm start"

Write-Host "✅ Services démarrés avec succès !" -ForegroundColor Green
Write-Host "🌐 Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host "📡 Backend: http://localhost:5000" -ForegroundColor Cyan
Write-Host "📊 API Health: http://localhost:5000/api/health" -ForegroundColor Cyan
