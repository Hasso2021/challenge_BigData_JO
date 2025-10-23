# notebooks/test_gdp_analysis.py
"""
Script de test pour l'analyse de corrélation PIB-médailles
"""

import sys
import os
from pathlib import Path

# Ajouter le répertoire parent au path pour les imports
ROOT = Path(__file__).resolve().parent.parent
sys.path.append(str(ROOT))

def test_gdp_analysis():
    """Tester l'analyse de corrélation PIB-médailles"""
    print("🧪 TEST DE L'ANALYSE PIB-MÉDAILLES")
    print("=" * 50)
    
    try:
        # Importer le module d'analyse
        from notebooks.gdp_medals_correlation_analysis import GDPMedalsAnalyzer
        
        # Créer l'analyseur
        analyzer = GDPMedalsAnalyzer()
        print("✅ Analyseur créé avec succès")
        
        # Tester le chargement des données de médailles
        print("\n📊 Test du chargement des données de médailles...")
        if analyzer.load_medals_data():
            print("✅ Données de médailles chargées")
            print(f"   - Nombre d'enregistrements: {len(analyzer.medals_data)}")
            print(f"   - Colonnes: {list(analyzer.medals_data.columns)}")
        else:
            print("❌ Erreur lors du chargement des données de médailles")
            return False
        
        # Tester les données PIB de secours
        print("\n🌍 Test des données PIB...")
        analyzer.gdp_data = analyzer.get_fallback_gdp_data()
        print("✅ Données PIB de secours chargées")
        print(f"   - Nombre de pays: {len(analyzer.gdp_data)}")
        
        # Tester l'analyse de corrélation par année
        print("\n📈 Test de l'analyse de corrélation par année...")
        correlation_results = analyzer.analyze_correlation_by_year([2020, 2021, 2022])
        
        if correlation_results:
            print("✅ Analyse de corrélation par année réussie")
            for year, results in correlation_results.items():
                print(f"   - {year}: Pearson={results['pearson']['correlation']:.3f}, "
                      f"Spearman={results['spearman']['correlation']:.3f}")
        else:
            print("❌ Erreur lors de l'analyse de corrélation par année")
            return False
        
        # Tester l'analyse par coût des sports
        print("\n🏅 Test de l'analyse par coût des sports...")
        sport_cost_results = analyzer.analyze_by_sport_cost(2022)
        
        if sport_cost_results:
            print("✅ Analyse par coût des sports réussie")
            for level, results in sport_cost_results.items():
                print(f"   - {level}: Pearson={results['pearson']['correlation']:.3f}")
        else:
            print("❌ Erreur lors de l'analyse par coût des sports")
            return False
        
        # Tester l'analyse PIB par habitant
        print("\n👥 Test de l'analyse PIB par habitant...")
        gdp_per_capita_results = analyzer.analyze_gdp_per_capita_correlation(2022)
        
        if gdp_per_capita_results:
            print("✅ Analyse PIB par habitant réussie")
            print(f"   - Pearson: {gdp_per_capita_results['pearson']['correlation']:.3f}")
            print(f"   - Spearman: {gdp_per_capita_results['spearman']['correlation']:.3f}")
        else:
            print("❌ Erreur lors de l'analyse PIB par habitant")
            return False
        
        print("\n🎉 TOUS LES TESTS SONT PASSÉS AVEC SUCCÈS!")
        return True
        
    except Exception as e:
        print(f"\n❌ ERREUR LORS DES TESTS: {e}")
        import traceback
        traceback.print_exc()
        return False

def test_backend_routes():
    """Tester les routes backend"""
    print("\n🔧 TEST DES ROUTES BACKEND")
    print("=" * 50)
    
    try:
        # Importer les routes
        from webapp.backend.routes.gdp_analysis_routes import (
            analyze_correlation_by_year,
            analyze_by_sport_cost,
            analyze_gdp_per_capita_correlation
        )
        
        print("✅ Routes importées avec succès")
        
        # Tester l'analyse de corrélation par année
        print("\n📈 Test de la route correlation-by-year...")
        results = analyze_correlation_by_year([2022, 2023])
        if results:
            print("✅ Route correlation-by-year fonctionne")
        else:
            print("❌ Erreur route correlation-by-year")
            return False
        
        # Tester l'analyse par coût des sports
        print("\n🏅 Test de la route correlation-by-sport-cost...")
        results = analyze_by_sport_cost(2022)
        if results:
            print("✅ Route correlation-by-sport-cost fonctionne")
        else:
            print("❌ Erreur route correlation-by-sport-cost")
            return False
        
        # Tester l'analyse PIB par habitant
        print("\n👥 Test de la route correlation-gdp-per-capita...")
        results = analyze_gdp_per_capita_correlation(2022)
        if results:
            print("✅ Route correlation-gdp-per-capita fonctionne")
        else:
            print("❌ Erreur route correlation-gdp-per-capita")
            return False
        
        print("\n🎉 TOUTES LES ROUTES BACKEND FONCTIONNENT!")
        return True
        
    except Exception as e:
        print(f"\n❌ ERREUR LORS DU TEST DES ROUTES: {e}")
        import traceback
        traceback.print_exc()
        return False

def main():
    """Fonction principale de test"""
    print("🚀 DÉMARRAGE DES TESTS PIB-MÉDAILLES")
    print("=" * 60)
    
    # Test de l'analyse principale
    analysis_success = test_gdp_analysis()
    
    # Test des routes backend
    routes_success = test_backend_routes()
    
    # Résumé des tests
    print("\n📋 RÉSUMÉ DES TESTS")
    print("=" * 30)
    print(f"✅ Analyse principale: {'PASSÉ' if analysis_success else 'ÉCHOUÉ'}")
    print(f"✅ Routes backend: {'PASSÉ' if routes_success else 'ÉCHOUÉ'}")
    
    if analysis_success and routes_success:
        print("\n🎉 TOUS LES TESTS SONT PASSÉS!")
        print("L'analyse PIB-médailles est prête à être utilisée.")
    else:
        print("\n❌ CERTAINS TESTS ONT ÉCHOUÉ")
        print("Vérifiez les erreurs ci-dessus.")
    
    return analysis_success and routes_success

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
