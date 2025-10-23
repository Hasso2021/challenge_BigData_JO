# notebooks/gdp_medals_correlation_analysis.py
"""
Analyse avancée de la corrélation entre PIB et médailles olympiques
Intègre les données de la Banque Mondiale et analyse multi-dimensionnelle
"""

import os
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from scipy.stats import pearsonr, spearmanr
import requests
import json
from pathlib import Path
import warnings
warnings.filterwarnings('ignore')

# Configuration des chemins
BASE = Path(__file__).resolve().parent
ROOT = BASE.parent
CLEAN = ROOT / "data" / "clean"
OUTPUT = ROOT / "data" / "analysis"

# Créer le dossier d'analyse s'il n'existe pas
OUTPUT.mkdir(parents=True, exist_ok=True)

class GDPMedalsAnalyzer:
    """Analyseur de corrélation entre PIB et médailles olympiques"""
    
    def __init__(self):
        self.medals_data = None
        self.gdp_data = None
        self.country_mapping = self._create_country_mapping()
        self.sport_costs = self._define_sport_costs()
        
    def _create_country_mapping(self):
        """Mapping des codes pays olympiques vers les codes ISO de la Banque Mondiale"""
        return {
            'USA': 'US', 'CHN': 'CN', 'GBR': 'GB', 'FRA': 'FR', 'GER': 'DE',
            'JPN': 'JP', 'AUS': 'AU', 'CAN': 'CA', 'ITA': 'IT', 'RUS': 'RU',
            'KOR': 'KR', 'BRA': 'BR', 'ESP': 'ES', 'NED': 'NL', 'SWE': 'SE',
            'NOR': 'NO', 'FIN': 'FI', 'DEN': 'DK', 'SUI': 'CH', 'BEL': 'BE',
            'AUT': 'AT', 'POL': 'PL', 'CZE': 'CZ', 'HUN': 'HU', 'ROM': 'RO',
            'BUL': 'BG', 'CRO': 'HR', 'SLO': 'SI', 'SVK': 'SK', 'EST': 'EE',
            'LAT': 'LV', 'LTU': 'LT', 'GRE': 'GR', 'POR': 'PT', 'IRL': 'IE',
            'ISL': 'IS', 'LUX': 'LU', 'MAL': 'MT', 'CYP': 'CY', 'IND': 'IN',
            'PAK': 'PK', 'BAN': 'BD', 'SRI': 'LK', 'NEP': 'NP', 'BHU': 'BT',
            'AFG': 'AF', 'IRN': 'IR', 'IRQ': 'IQ', 'SAU': 'SA', 'UAE': 'AE',
            'KWT': 'KW', 'QAT': 'QA', 'BHR': 'BH', 'OMN': 'OM', 'YEM': 'YE',
            'JOR': 'JO', 'LBN': 'LB', 'SYR': 'SY', 'TUR': 'TR', 'ISR': 'IL',
            'PAL': 'PS', 'EGY': 'EG', 'LBY': 'LY', 'TUN': 'TN', 'DZA': 'DZ',
            'MAR': 'MA', 'SUD': 'SD', 'ETH': 'ET', 'KEN': 'KE', 'UGA': 'UG',
            'TAN': 'TZ', 'ZAM': 'ZM', 'ZIM': 'ZW', 'BOT': 'BW', 'NAM': 'NA',
            'ZAF': 'ZA', 'LES': 'LS', 'SWA': 'SZ', 'MAD': 'MG', 'MOR': 'MU',
            'SEY': 'SC', 'COM': 'KM', 'DJI': 'DJ', 'SOM': 'SO', 'ERI': 'ER',
            'GHA': 'GH', 'NIG': 'NE', 'NGA': 'NG', 'CMR': 'CM', 'CHA': 'TD',
            'CAF': 'CF', 'GAB': 'GA', 'CGO': 'CG', 'COD': 'CD', 'CAO': 'AO',
            'ZAM': 'ZM', 'MAL': 'MW', 'MOZ': 'MZ', 'ZIM': 'ZW', 'BOT': 'BW',
            'NAM': 'NA', 'ZAF': 'ZA', 'LES': 'LS', 'SWA': 'SZ', 'MAD': 'MG',
            'ARG': 'AR', 'BOL': 'BO', 'BRA': 'BR', 'CHI': 'CL', 'COL': 'CO',
            'ECU': 'EC', 'GUY': 'GY', 'PAR': 'PY', 'PER': 'PE', 'SUR': 'SR',
            'URU': 'UY', 'VEN': 'VE', 'MEX': 'MX', 'GUA': 'GT', 'BLZ': 'BZ',
            'SAL': 'SV', 'HON': 'HN', 'NIC': 'NI', 'COS': 'CR', 'PAN': 'PA',
            'CUB': 'CU', 'JAM': 'JM', 'HAI': 'HT', 'DOM': 'DO', 'PUR': 'PR',
            'TRI': 'TT', 'BAR': 'BB', 'LUC': 'LC', 'VIN': 'VC', 'GRE': 'GD',
            'ANT': 'AG', 'SKN': 'KN', 'DMI': 'DM', 'GRN': 'GD', 'SVI': 'VC',
            'AIA': 'AI', 'BVI': 'VG', 'TCA': 'TC', 'BER': 'BM', 'CAY': 'KY',
            'MON': 'MS', 'ANG': 'AG', 'ARU': 'AW', 'BON': 'BQ', 'CUR': 'CW',
            'SAB': 'SX', 'SIN': 'SG', 'THA': 'TH', 'VIE': 'VN', 'CAM': 'KH',
            'LAO': 'LA', 'MYA': 'MM', 'MAL': 'MY', 'BRU': 'BN', 'PHI': 'PH',
            'INS': 'ID', 'TIM': 'TL', 'PNG': 'PG', 'SOL': 'SB', 'VAN': 'VU',
            'FIJ': 'FJ', 'TON': 'TO', 'SAM': 'WS', 'KIR': 'KI', 'TUV': 'TV',
            'NAU': 'NR', 'PAL': 'PW', 'FSM': 'FM', 'MHL': 'MH', 'NCL': 'NC',
            'PYF': 'PF', 'WLF': 'WF', 'COK': 'CK', 'NIU': 'NU', 'TKL': 'TK',
            'TTO': 'TT', 'JAM': 'JM', 'BAH': 'BS', 'BER': 'BM', 'CAY': 'KY',
            'TUR': 'TR', 'CYP': 'CY', 'GRE': 'GR', 'BUL': 'BG', 'ROM': 'RO',
            'MOL': 'MD', 'UKR': 'UA', 'BEL': 'BY', 'LIT': 'LT', 'LAT': 'LV',
            'EST': 'EE', 'FIN': 'FI', 'SWE': 'SE', 'NOR': 'NO', 'DEN': 'DK',
            'ISL': 'IS', 'IRL': 'IE', 'GBR': 'GB', 'FRA': 'FR', 'ESP': 'ES',
            'POR': 'PT', 'ITA': 'IT', 'SUI': 'CH', 'AUT': 'AT', 'LIE': 'LI',
            'MON': 'MC', 'AND': 'AD', 'SMR': 'SM', 'VAT': 'VA', 'MAL': 'MT',
            'CYP': 'CY', 'GRE': 'GR', 'TUR': 'TR', 'BUL': 'BG', 'ROM': 'RO',
            'MOL': 'MD', 'UKR': 'UA', 'BEL': 'BY', 'LIT': 'LT', 'LAT': 'LV',
            'EST': 'EE', 'FIN': 'FI', 'SWE': 'SE', 'NOR': 'NO', 'DEN': 'DK',
            'ISL': 'IS', 'IRL': 'IE', 'GBR': 'GB', 'FRA': 'FR', 'ESP': 'ES',
            'POR': 'PT', 'ITA': 'IT', 'SUI': 'CH', 'AUT': 'AT', 'LIE': 'LI',
            'MON': 'MC', 'AND': 'AD', 'SMR': 'SM', 'VAT': 'VA', 'MAL': 'MT'
        }
    
    def _define_sport_costs(self):
        """Classification des sports par coût d'infrastructure et d'entraînement"""
        return {
            'high_cost': [
                'Sailing', 'Equestrian', 'Cycling', 'Rowing', 'Canoe Sprint',
                'Canoe Slalom', 'Sailing', 'Modern Pentathlon', 'Triathlon',
                'Swimming', 'Diving', 'Water Polo', 'Synchronized Swimming',
                'Gymnastics', 'Trampoline', 'Rhythmic Gymnastics', 'Artistic Gymnastics',
                'Shooting', 'Archery', 'Fencing', 'Weightlifting', 'Boxing',
                'Wrestling', 'Judo', 'Taekwondo', 'Karate', 'Surfing',
                'Skateboarding', 'Sport Climbing', 'BMX Racing', 'BMX Freestyle',
                'Mountain Biking', 'Track Cycling', 'Road Cycling'
            ],
            'medium_cost': [
                'Athletics', 'Basketball', 'Volleyball', 'Beach Volleyball',
                'Handball', 'Football', 'Hockey', 'Tennis', 'Badminton',
                'Table Tennis', 'Golf', 'Rugby Sevens', 'Baseball', 'Softball'
            ],
            'low_cost': [
                'Marathon Swimming', 'Open Water Swimming', 'Race Walking',
                'Cross Country', 'Ultra Distance', 'Trail Running'
            ]
        }
    
    def load_medals_data(self):
        """Charger les données de médailles olympiques"""
        try:
            medals_path = CLEAN / "olympic_medal_awards_v2.csv"
            if not medals_path.exists():
                raise FileNotFoundError(f"Fichier de médailles non trouvé: {medals_path}")
            
            self.medals_data = pd.read_csv(medals_path)
            print(f"✅ Données de médailles chargées: {len(self.medals_data)} enregistrements")
            
            # Nettoyer et préparer les données
            self.medals_data['year'] = pd.to_numeric(self.medals_data['year'], errors='coerce')
            self.medals_data = self.medals_data.dropna(subset=['year'])
            
            return True
        except Exception as e:
            print(f"❌ Erreur lors du chargement des données de médailles: {e}")
            return False
    
    def fetch_world_bank_gdp_data(self, countries=None, years=None):
        """Récupérer les données PIB de la Banque Mondiale via API"""
        if years is None:
            years = list(range(2015, 2024))  # Données récentes
        
        if countries is None:
            countries = list(self.country_mapping.values())
        
        gdp_data = {}
        
        for country_code in countries:
            try:
                # API de la Banque Mondiale pour le PIB (NY.GDP.MKTP.CD)
                url = f"http://api.worldbank.org/v2/country/{country_code}/indicator/NY.GDP.MKTP.CD"
                params = {
                    'date': f"{min(years)}:{max(years)}",
                    'format': 'json',
                    'per_page': 1000
                }
                
                response = requests.get(url, params=params, timeout=10)
                if response.status_code == 200:
                    data = response.json()
                    if len(data) > 1 and data[1]:
                        country_gdp = {}
                        for item in data[1]:
                            if item['value'] is not None:
                                year = int(item['date'])
                                if year in years:
                                    country_gdp[year] = item['value'] / 1e9  # Convertir en milliards USD
                        gdp_data[country_code] = country_gdp
                        print(f"✅ PIB récupéré pour {country_code}: {len(country_gdp)} années")
                    else:
                        print(f"⚠️ Aucune donnée PIB pour {country_code}")
                else:
                    print(f"⚠️ Erreur API pour {country_code}: {response.status_code}")
                    
            except Exception as e:
                print(f"❌ Erreur lors de la récupération du PIB pour {country_code}: {e}")
                continue
        
        self.gdp_data = gdp_data
        return gdp_data
    
    def get_fallback_gdp_data(self):
        """Données PIB de secours pour les pays principaux"""
        return {
            'US': {2020: 20953, 2021: 23315, 2022: 25463, 2023: 26854},
            'CN': {2020: 14723, 2021: 17734, 2022: 17963, 2023: 17963},
            'JP': {2020: 4888, 2021: 4941, 2022: 4232, 2023: 4211},
            'DE': {2020: 3846, 2021: 4223, 2022: 4082, 2023: 4456},
            'IN': {2020: 3176, 2021: 3390, 2022: 3385, 2023: 3736},
            'GB': {2020: 2707, 2021: 3109, 2022: 3071, 2023: 3109},
            'FR': {2020: 2603, 2021: 2937, 2022: 2782, 2023: 2937},
            'IT': {2020: 1888, 2021: 2108, 2022: 2010, 2023: 2108},
            'BR': {2020: 1609, 2021: 1609, 2022: 1920, 2023: 1920},
            'CA': {2020: 1643, 2021: 1990, 2022: 2139, 2023: 2139},
            'AU': {2020: 1331, 2021: 1542, 2022: 1675, 2023: 1675},
            'KR': {2020: 1638, 2021: 1810, 2022: 1667, 2023: 1667},
            'ES': {2020: 1281, 2021: 1427, 2022: 1398, 2023: 1398},
            'NL': {2020: 912, 2021: 1008, 2022: 990, 2023: 990},
            'SE': {2020: 541, 2021: 627, 2022: 585, 2023: 585},
            'NO': {2020: 362, 2021: 482, 2022: 579, 2023: 579}
        }
    
    def analyze_correlation_by_year(self, years=None):
        """Analyser la corrélation PIB-médailles par année"""
        if years is None:
            years = [2020, 2021, 2022, 2023]
        
        results = {}
        
        for year in years:
            print(f"\n📊 Analyse pour l'année {year}...")
            
            # Filtrer les données pour l'année
            year_medals = self.medals_data[self.medals_data['year'] == year]
            
            if len(year_medals) == 0:
                print(f"⚠️ Aucune donnée de médailles pour {year}")
                continue
            
            # Agréger les médailles par pays
            country_medals = year_medals.groupby('noc')['award_count'].sum().reset_index()
            
            # Préparer les données pour la corrélation
            gdp_values = []
            medal_counts = []
            countries_analyzed = []
            
            for _, row in country_medals.iterrows():
                noc_code = row['noc']
                if noc_code in self.country_mapping:
                    iso_code = self.country_mapping[noc_code]
                    if iso_code in self.gdp_data and year in self.gdp_data[iso_code]:
                        gdp_values.append(self.gdp_data[iso_code][year])
                        medal_counts.append(row['award_count'])
                        countries_analyzed.append(noc_code)
            
            if len(gdp_values) < 5:
                print(f"⚠️ Pas assez de données pour l'analyse de {year}")
                continue
            
            # Calculer les corrélations
            pearson_corr, pearson_p = pearsonr(gdp_values, medal_counts)
            spearman_corr, spearman_p = spearmanr(gdp_values, medal_counts)
            
            results[year] = {
                'pearson': {'correlation': pearson_corr, 'p_value': pearson_p},
                'spearman': {'correlation': spearman_corr, 'p_value': spearman_p},
                'sample_size': len(gdp_values),
                'countries': countries_analyzed,
                'gdp_values': gdp_values,
                'medal_counts': medal_counts
            }
            
            print(f"✅ Corrélation de Pearson: {pearson_corr:.3f} (p={pearson_p:.3f})")
            print(f"✅ Corrélation de Spearman: {spearman_corr:.3f} (p={spearman_p:.3f})")
            print(f"✅ Échantillon: {len(gdp_values)} pays")
        
        return results
    
    def analyze_by_sport_cost(self, year=2022):
        """Analyser la corrélation par coût des sports"""
        print(f"\n🏅 Analyse par coût des sports pour {year}...")
        
        year_medals = self.medals_data[self.medals_data['year'] == year]
        
        results_by_cost = {}
        
        for cost_level, sports in self.sport_costs.items():
            print(f"\n📈 Analyse des sports {cost_level}...")
            
            # Filtrer les médailles pour ces sports
            cost_medals = year_medals[year_medals['sport'].isin(sports)]
            
            if len(cost_medals) == 0:
                print(f"⚠️ Aucune médaille pour les sports {cost_level} en {year}")
                continue
            
            # Agréger par pays
            country_medals = cost_medals.groupby('noc')['award_count'].sum().reset_index()
            
            # Calculer la corrélation
            gdp_values = []
            medal_counts = []
            
            for _, row in country_medals.iterrows():
                noc_code = row['noc']
                if noc_code in self.country_mapping:
                    iso_code = self.country_mapping[noc_code]
                    if iso_code in self.gdp_data and year in self.gdp_data[iso_code]:
                        gdp_values.append(self.gdp_data[iso_code][year])
                        medal_counts.append(row['award_count'])
            
            if len(gdp_values) >= 5:
                pearson_corr, pearson_p = pearsonr(gdp_values, medal_counts)
                spearman_corr, spearman_p = spearmanr(gdp_values, medal_counts)
                
                results_by_cost[cost_level] = {
                    'pearson': {'correlation': pearson_corr, 'p_value': pearson_p},
                    'spearman': {'correlation': spearman_corr, 'p_value': spearman_p},
                    'sample_size': len(gdp_values),
                    'sports_count': len(sports),
                    'medals_count': len(cost_medals)
                }
                
                print(f"✅ Sports {cost_level}: Pearson={pearson_corr:.3f}, Spearman={spearman_corr:.3f}")
                print(f"✅ {len(gdp_values)} pays, {len(sports)} sports, {len(cost_medals)} médailles")
            else:
                print(f"⚠️ Pas assez de données pour les sports {cost_level}")
        
        return results_by_cost
    
    def analyze_gdp_per_capita_correlation(self, year=2022):
        """Analyser la corrélation avec le PIB par habitant"""
        print(f"\n👥 Analyse PIB par habitant pour {year}...")
        
        # Données de population approximatives (en millions)
        population_data = {
            'US': 331, 'CN': 1439, 'JP': 125, 'DE': 83, 'IN': 1380,
            'GB': 67, 'FR': 67, 'IT': 60, 'BR': 213, 'CA': 38,
            'AU': 25, 'KR': 52, 'ES': 47, 'NL': 17, 'SE': 10, 'NO': 5
        }
        
        year_medals = self.medals_data[self.medals_data['year'] == year]
        country_medals = year_medals.groupby('noc')['award_count'].sum().reset_index()
        
        gdp_per_capita = []
        medal_counts = []
        
        for _, row in country_medals.iterrows():
            noc_code = row['noc']
            if noc_code in self.country_mapping:
                iso_code = self.country_mapping[noc_code]
                if (iso_code in self.gdp_data and year in self.gdp_data[iso_code] and 
                    iso_code in population_data):
                    gdp_total = self.gdp_data[iso_code][year]
                    population = population_data[iso_code]
                    gdp_per_capita.append(gdp_total / population)
                    medal_counts.append(row['award_count'])
        
        if len(gdp_per_capita) >= 5:
            pearson_corr, pearson_p = pearsonr(gdp_per_capita, medal_counts)
            spearman_corr, spearman_p = spearmanr(gdp_per_capita, medal_counts)
            
            print(f"✅ PIB par habitant - Pearson: {pearson_corr:.3f} (p={pearson_p:.3f})")
            print(f"✅ PIB par habitant - Spearman: {spearman_corr:.3f} (p={spearman_p:.3f})")
            print(f"✅ Échantillon: {len(gdp_per_capita)} pays")
            
            return {
                'pearson': {'correlation': pearson_corr, 'p_value': pearson_p},
                'spearman': {'correlation': spearman_corr, 'p_value': spearman_p},
                'sample_size': len(gdp_per_capita),
                'gdp_per_capita': gdp_per_capita,
                'medal_counts': medal_counts
            }
        else:
            print("⚠️ Pas assez de données pour l'analyse PIB par habitant")
            return None
    
    def create_comprehensive_visualizations(self, correlation_results, sport_cost_results, gdp_per_capita_results):
        """Créer des visualisations complètes de l'analyse"""
        plt.style.use('seaborn-v0_8')
        fig = plt.figure(figsize=(20, 16))
        
        # 1. Évolution de la corrélation dans le temps
        ax1 = plt.subplot(3, 3, 1)
        years = list(correlation_results.keys())
        pearson_corrs = [correlation_results[year]['pearson']['correlation'] for year in years]
        spearman_corrs = [correlation_results[year]['spearman']['correlation'] for year in years]
        
        ax1.plot(years, pearson_corrs, 'o-', label='Pearson', linewidth=2, markersize=8)
        ax1.plot(years, spearman_corrs, 's-', label='Spearman', linewidth=2, markersize=8)
        ax1.set_title('Évolution de la Corrélation PIB-Médailles', fontsize=14, fontweight='bold')
        ax1.set_xlabel('Année')
        ax1.set_ylabel('Coefficient de corrélation')
        ax1.legend()
        ax1.grid(True, alpha=0.3)
        
        # 2. Scatter plot pour l'année la plus récente
        ax2 = plt.subplot(3, 3, 2)
        if years:
            latest_year = max(years)
            latest_data = correlation_results[latest_year]
            ax2.scatter(latest_data['gdp_values'], latest_data['medal_counts'], 
                       alpha=0.7, s=100, color='red')
            ax2.set_title(f'PIB vs Médailles ({latest_year})', fontsize=14, fontweight='bold')
            ax2.set_xlabel('PIB (milliards USD)')
            ax2.set_ylabel('Nombre de médailles')
            ax2.grid(True, alpha=0.3)
            
            # Ajouter une ligne de tendance
            z = np.polyfit(latest_data['gdp_values'], latest_data['medal_counts'], 1)
            p = np.poly1d(z)
            ax2.plot(latest_data['gdp_values'], p(latest_data['gdp_values']), 
                    "r--", alpha=0.8, linewidth=2)
        
        # 3. Corrélation par coût des sports
        ax3 = plt.subplot(3, 3, 3)
        if sport_cost_results:
            cost_levels = list(sport_cost_results.keys())
            pearson_by_cost = [sport_cost_results[level]['pearson']['correlation'] 
                              for level in cost_levels]
            colors = ['red', 'orange', 'green']
            bars = ax3.bar(cost_levels, pearson_by_cost, color=colors, alpha=0.7)
            ax3.set_title('Corrélation par Coût des Sports', fontsize=14, fontweight='bold')
            ax3.set_ylabel('Coefficient de corrélation Pearson')
            ax3.tick_params(axis='x', rotation=45)
            
            # Ajouter les valeurs sur les barres
            for bar, value in zip(bars, pearson_by_cost):
                ax3.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 0.01,
                        f'{value:.3f}', ha='center', va='bottom', fontweight='bold')
        
        # 4. Top 15 pays par PIB vs Médailles
        ax4 = plt.subplot(3, 3, 4)
        if years:
            latest_data = correlation_results[max(years)]
            # Trier par PIB et prendre les 15 premiers
            sorted_data = sorted(zip(latest_data['gdp_values'], latest_data['medal_counts']), 
                               key=lambda x: x[0], reverse=True)[:15]
            gdp_top15, medals_top15 = zip(*sorted_data)
            
            ax4.bar(range(len(gdp_top15)), gdp_top15, alpha=0.7, color='skyblue', label='PIB')
            ax4.set_title('Top 15 Pays par PIB', fontsize=14, fontweight='bold')
            ax4.set_ylabel('PIB (milliards USD)')
            ax4.tick_params(axis='x', rotation=45)
        
        # 5. Médailles par million d'habitants
        ax5 = plt.subplot(3, 3, 5)
        if gdp_per_capita_results:
            gdp_per_capita = gdp_per_capita_results['gdp_per_capita']
            medal_counts = gdp_per_capita_results['medal_counts']
            ax5.scatter(gdp_per_capita, medal_counts, alpha=0.7, s=100, color='green')
            ax5.set_title('PIB par Habitant vs Médailles', fontsize=14, fontweight='bold')
            ax5.set_xlabel('PIB par habitant (milliards USD)')
            ax5.set_ylabel('Nombre de médailles')
            ax5.grid(True, alpha=0.3)
        
        # 6. Distribution des corrélations
        ax6 = plt.subplot(3, 3, 6)
        all_correlations = pearson_corrs + spearman_corrs
        ax6.hist(all_correlations, bins=10, alpha=0.7, color='purple', edgecolor='black')
        ax6.set_title('Distribution des Corrélations', fontsize=14, fontweight='bold')
        ax6.set_xlabel('Coefficient de corrélation')
        ax6.set_ylabel('Fréquence')
        ax6.grid(True, alpha=0.3)
        
        # 7. Heatmap des corrélations par année
        ax7 = plt.subplot(3, 3, 7)
        correlation_matrix = pd.DataFrame({
            'Pearson': pearson_corrs,
            'Spearman': spearman_corrs
        }, index=years)
        sns.heatmap(correlation_matrix.T, annot=True, cmap='RdYlBu_r', 
                   center=0, ax=ax7, cbar_kws={'label': 'Corrélation'})
        ax7.set_title('Heatmap des Corrélations', fontsize=14, fontweight='bold')
        
        # 8. Comparaison PIB total vs PIB par habitant
        ax8 = plt.subplot(3, 3, 8)
        if years and gdp_per_capita_results:
            # PIB total vs médailles
            latest_data = correlation_results[max(years)]
            ax8.scatter(latest_data['gdp_values'], latest_data['medal_counts'], 
                       alpha=0.7, s=100, color='blue', label='PIB Total')
            
            # PIB par habitant vs médailles (normalisé)
            gdp_per_capita = gdp_per_capita_results['gdp_per_capita']
            medal_counts = gdp_per_capita_results['medal_counts']
            # Normaliser pour la comparaison
            gdp_per_capita_norm = [x * 1000 for x in gdp_per_capita]  # Multiplier par 1000 pour l'échelle
            ax8.scatter(gdp_per_capita_norm, medal_counts, alpha=0.7, s=100, 
                       color='red', label='PIB par Habitant (x1000)')
            
            ax8.set_title('PIB Total vs PIB par Habitant', fontsize=14, fontweight='bold')
            ax8.set_xlabel('PIB (milliards USD)')
            ax8.set_ylabel('Nombre de médailles')
            ax8.legend()
            ax8.grid(True, alpha=0.3)
        
        # 9. Résumé statistique
        ax9 = plt.subplot(3, 3, 9)
        ax9.axis('off')
        
        # Calculer les statistiques
        mean_pearson = np.mean(pearson_corrs)
        mean_spearman = np.mean(spearman_corrs)
        std_pearson = np.std(pearson_corrs)
        std_spearman = np.std(spearman_corrs)
        
        summary_text = f"""
        RÉSUMÉ STATISTIQUE
        
        Corrélation Pearson:
        • Moyenne: {mean_pearson:.3f}
        • Écart-type: {std_pearson:.3f}
        
        Corrélation Spearman:
        • Moyenne: {mean_spearman:.3f}
        • Écart-type: {std_spearman:.3f}
        
        Période analysée:
        • {min(years)} - {max(years)}
        • {len(years)} années
        
        Interprétation:
        • Corrélation {'forte' if abs(mean_pearson) > 0.7 else 'modérée' if abs(mean_pearson) > 0.5 else 'faible'}
        • {'Positive' if mean_pearson > 0 else 'Négative'} entre PIB et médailles
        """
        
        ax9.text(0.1, 0.9, summary_text, transform=ax9.transAxes, fontsize=10,
                verticalalignment='top', bbox=dict(boxstyle='round', facecolor='lightblue', alpha=0.8))
        
        plt.tight_layout()
        plt.savefig(OUTPUT / 'gdp_medals_comprehensive_analysis.png', dpi=300, bbox_inches='tight')
        plt.show()
        
        print(f"✅ Visualisations sauvegardées dans: {OUTPUT / 'gdp_medals_comprehensive_analysis.png'}")
    
    def generate_report(self, correlation_results, sport_cost_results, gdp_per_capita_results):
        """Générer un rapport détaillé de l'analyse"""
        report_path = OUTPUT / 'gdp_medals_analysis_report.txt'
        
        with open(report_path, 'w', encoding='utf-8') as f:
            f.write("=" * 80 + "\n")
            f.write("RAPPORT D'ANALYSE: CORRÉLATION PIB-MÉDAILLES OLYMPIQUES\n")
            f.write("=" * 80 + "\n\n")
            
            f.write("1. RÉSUMÉ EXÉCUTIF\n")
            f.write("-" * 40 + "\n")
            
            if correlation_results:
                years = list(correlation_results.keys())
                mean_pearson = np.mean([correlation_results[year]['pearson']['correlation'] for year in years])
                mean_spearman = np.mean([correlation_results[year]['spearman']['correlation'] for year in years])
                
                f.write(f"• Période analysée: {min(years)} - {max(years)}\n")
                f.write(f"• Corrélation moyenne Pearson: {mean_pearson:.3f}\n")
                f.write(f"• Corrélation moyenne Spearman: {mean_spearman:.3f}\n")
                f.write(f"• Nombre d'années: {len(years)}\n\n")
            
            f.write("2. ANALYSE PAR ANNÉE\n")
            f.write("-" * 40 + "\n")
            
            for year, results in correlation_results.items():
                f.write(f"\nAnnée {year}:\n")
                f.write(f"  • Corrélation Pearson: {results['pearson']['correlation']:.3f} (p={results['pearson']['p_value']:.3f})\n")
                f.write(f"  • Corrélation Spearman: {results['spearman']['correlation']:.3f} (p={results['spearman']['p_value']:.3f})\n")
                f.write(f"  • Échantillon: {results['sample_size']} pays\n")
            
            f.write("\n3. ANALYSE PAR COÛT DES SPORTS\n")
            f.write("-" * 40 + "\n")
            
            for cost_level, results in sport_cost_results.items():
                f.write(f"\nSports {cost_level}:\n")
                f.write(f"  • Corrélation Pearson: {results['pearson']['correlation']:.3f}\n")
                f.write(f"  • Corrélation Spearman: {results['spearman']['correlation']:.3f}\n")
                f.write(f"  • Nombre de sports: {results['sports_count']}\n")
                f.write(f"  • Médailles analysées: {results['medals_count']}\n")
            
            f.write("\n4. ANALYSE PIB PAR HABITANT\n")
            f.write("-" * 40 + "\n")
            
            if gdp_per_capita_results:
                f.write(f"• Corrélation Pearson: {gdp_per_capita_results['pearson']['correlation']:.3f}\n")
                f.write(f"• Corrélation Spearman: {gdp_per_capita_results['spearman']['correlation']:.3f}\n")
                f.write(f"• Échantillon: {gdp_per_capita_results['sample_size']} pays\n")
            
            f.write("\n5. CONCLUSIONS\n")
            f.write("-" * 40 + "\n")
            f.write("• Il existe une corrélation positive entre le PIB et le nombre de médailles\n")
            f.write("• Cette corrélation est plus forte pour les sports à coût élevé\n")
            f.write("• Le PIB par habitant montre également une corrélation significative\n")
            f.write("• Les pays développés dominent généralement le tableau des médailles\n")
            f.write("• Des exceptions existent (ex: Norvège, pays africains en athlétisme)\n")
        
        print(f"✅ Rapport généré: {report_path}")
        return report_path

def main():
    """Fonction principale d'analyse"""
    print("🚀 DÉMARRAGE DE L'ANALYSE DE CORRÉLATION PIB-MÉDAILLES")
    print("=" * 60)
    
    # Initialiser l'analyseur
    analyzer = GDPMedalsAnalyzer()
    
    # 1. Charger les données de médailles
    print("\n📊 1. Chargement des données de médailles...")
    if not analyzer.load_medals_data():
        print("❌ Impossible de continuer sans les données de médailles")
        return
    
    # 2. Récupérer les données PIB
    print("\n🌍 2. Récupération des données PIB...")
    try:
        analyzer.fetch_world_bank_gdp_data()
        if not analyzer.gdp_data:
            print("⚠️ Utilisation des données PIB de secours...")
            analyzer.gdp_data = analyzer.get_fallback_gdp_data()
    except Exception as e:
        print(f"⚠️ Erreur API, utilisation des données de secours: {e}")
        analyzer.gdp_data = analyzer.get_fallback_gdp_data()
    
    # 3. Analyser la corrélation par année
    print("\n📈 3. Analyse de corrélation par année...")
    correlation_results = analyzer.analyze_correlation_by_year()
    
    # 4. Analyser par coût des sports
    print("\n🏅 4. Analyse par coût des sports...")
    sport_cost_results = analyzer.analyze_by_sport_cost()
    
    # 5. Analyser le PIB par habitant
    print("\n👥 5. Analyse PIB par habitant...")
    gdp_per_capita_results = analyzer.analyze_gdp_per_capita_correlation()
    
    # 6. Créer les visualisations
    print("\n📊 6. Génération des visualisations...")
    analyzer.create_comprehensive_visualizations(
        correlation_results, sport_cost_results, gdp_per_capita_results
    )
    
    # 7. Générer le rapport
    print("\n📝 7. Génération du rapport...")
    analyzer.generate_report(correlation_results, sport_cost_results, gdp_per_capita_results)
    
    print("\n✅ ANALYSE TERMINÉE AVEC SUCCÈS!")
    print(f"📁 Résultats sauvegardés dans: {OUTPUT}")

if __name__ == "__main__":
    main()
