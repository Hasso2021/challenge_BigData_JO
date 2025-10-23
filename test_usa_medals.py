#!/usr/bin/env python3
"""
Script pour tester les médailles USA après les modifications
"""
import requests
import json

def test_usa_medals():
    try:
        print("🔍 Test des médailles USA...")
        
        # Appeler l'API
        response = requests.get('http://localhost:5000/api/medals/country-performance')
        
        if response.status_code == 200:
            data = response.json()
            
            # Chercher les données USA
            usa_data = None
            for country in data['data']['top_countries']:
                if country['country'] == 'USA':
                    usa_data = country
                    break
            
            if usa_data:
                print(f"✅ USA trouvé dans les données")
                print(f"📊 Médailles USA: {usa_data['total']}")
                print(f"🥇 Or: {usa_data['gold']}")
                print(f"🥈 Argent: {usa_data['silver']}")
                print(f"🥉 Bronze: {usa_data['bronze']}")
                
                if usa_data['total'] >= 2000:
                    print("🎉 SUCCÈS: Les modifications ont fonctionné !")
                else:
                    print("⚠️ ATTENTION: Les données semblent encore limitées")
            else:
                print("❌ USA non trouvé dans les données")
                print("Pays disponibles:", [c['country'] for c in data['data']['top_countries'][:5]])
        else:
            print(f"❌ Erreur API: {response.status_code}")
            
    except Exception as e:
        print(f"❌ Erreur: {e}")

if __name__ == "__main__":
    test_usa_medals()
