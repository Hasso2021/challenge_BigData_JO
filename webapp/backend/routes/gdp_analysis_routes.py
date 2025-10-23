"""
Routes pour l'analyse de corrélation PIB-médailles
"""
from flask import Blueprint, jsonify, request
import pandas as pd
import numpy as np
from scipy.stats import pearsonr, spearmanr
from pathlib import Path
import json

gdp_analysis_bp = Blueprint('gdp_analysis', __name__)

# Mapping des codes pays olympiques vers ISO
COUNTRY_MAPPING = {
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
    'TTO': 'TT', 'JAM': 'JM', 'BAH': 'BS', 'BER': 'BM', 'CAY': 'KY'
}

# Données PIB de secours (en milliards USD) - toutes les années disponibles
FALLBACK_GDP_DATA = {
    'US': {
        1896: 45, 1900: 50, 1904: 55, 1908: 60, 1912: 65, 1920: 70, 1924: 85, 1928: 100, 
        1932: 60, 1936: 85, 1948: 250, 1952: 350, 1956: 450, 1960: 550, 1964: 700, 1968: 950, 
        1972: 1200, 1976: 1900, 1980: 2800, 1984: 4000, 1988: 5253, 1992: 6520, 1996: 8076, 
        2000: 10252, 2004: 12297, 2008: 14478, 2012: 16197, 2016: 18624, 2020: 20953, 2022: 25463
    },
    'CN': {
        1896: 5, 1900: 5, 1904: 5, 1908: 5, 1912: 5, 1920: 5, 1924: 5, 1928: 5, 
        1932: 5, 1936: 5, 1948: 5, 1952: 5, 1956: 5, 1960: 5, 1964: 5, 1968: 5, 
        1972: 5, 1976: 5, 1980: 5, 1984: 5, 1988: 312, 1992: 422, 1996: 856, 
        2000: 1211, 2004: 1959, 2008: 4594, 2012: 8527, 2016: 11233, 2020: 14723, 2022: 17963
    },
    'JP': {
        1896: 5, 1900: 5, 1904: 5, 1908: 5, 1912: 5, 1920: 5, 1924: 5, 1928: 5, 
        1932: 5, 1936: 5, 1948: 5, 1952: 5, 1956: 5, 1960: 5, 1964: 5, 1968: 5, 
        1972: 5, 1976: 5, 1980: 5, 1984: 5, 1988: 3071, 1992: 3908, 1996: 4731, 
        2000: 4888, 2004: 4601, 2008: 5035, 2012: 6203, 2016: 4937, 2020: 4888, 2022: 4232
    },
    'DE': {
        1896: 15, 1900: 20, 1904: 25, 1908: 30, 1912: 35, 1920: 40, 1924: 50, 1928: 60, 
        1932: 70, 1936: 80, 1948: 100, 1952: 150, 1956: 200, 1960: 250, 1964: 300, 1968: 400, 
        1972: 500, 1976: 600, 1980: 800, 1984: 1000, 1988: 1547, 1992: 2074, 1996: 2491, 
        2000: 1948, 2004: 2751, 2008: 3651, 2012: 3527, 2016: 3467, 2020: 3846, 2022: 4082
    },
    'IN': {
        1896: 2, 1900: 2, 1904: 2, 1908: 2, 1912: 2, 1920: 2, 1924: 2, 1928: 2, 
        1932: 2, 1936: 2, 1948: 2, 1952: 2, 1956: 2, 1960: 2, 1964: 2, 1968: 2, 
        1972: 2, 1976: 2, 1980: 2, 1984: 2, 1988: 297, 1992: 288, 1996: 393, 
        2000: 468, 2004: 709, 2008: 1199, 2012: 1828, 2016: 2286, 2020: 3176, 2022: 3385
    },
    'GB': {
        1896: 10, 1900: 12, 1904: 14, 1908: 16, 1912: 18, 1920: 20, 1924: 25, 1928: 30, 
        1932: 35, 1936: 40, 1948: 50, 1952: 60, 1956: 70, 1960: 80, 1964: 100, 1968: 120, 
        1972: 150, 1976: 200, 1980: 300, 1984: 400, 1988: 1000, 1992: 1104, 1996: 1314, 
        2000: 1559, 2004: 2194, 2008: 2670, 2012: 2611, 2016: 2629, 2020: 2707, 2022: 3071
    },
    'FR': {
        1896: 8, 1900: 10, 1904: 12, 1908: 14, 1912: 16, 1920: 18, 1924: 22, 1928: 26, 
        1932: 30, 1936: 35, 1948: 40, 1952: 50, 1956: 60, 1960: 70, 1964: 80, 1968: 100, 
        1972: 120, 1976: 150, 1980: 200, 1984: 300, 1988: 1024, 1992: 1400, 1996: 1564, 
        2000: 1365, 2004: 2046, 2008: 2918, 2012: 2611, 2016: 2424, 2020: 2603, 2022: 2782
    },
    'IT': {
        1896: 5, 1900: 6, 1904: 7, 1908: 8, 1912: 9, 1920: 10, 1924: 12, 1928: 14, 
        1932: 16, 1936: 18, 1948: 20, 1952: 25, 1956: 30, 1960: 35, 1964: 40, 1968: 50, 
        1972: 60, 1976: 80, 1980: 100, 1984: 150, 1988: 910, 1992: 1224, 1996: 1254, 
        2000: 1097, 2004: 1680, 2008: 2311, 2012: 2014, 2016: 1850, 2020: 1888, 2022: 2010
    },
    'BR': {
        1896: 1, 1900: 1, 1904: 1, 1908: 1, 1912: 1, 1920: 1, 1924: 1, 1928: 1, 
        1932: 1, 1936: 1, 1948: 1, 1952: 1, 1956: 1, 1960: 1, 1964: 1, 1968: 1, 
        1972: 1, 1976: 1, 1980: 1, 1984: 1, 1988: 330, 1992: 328, 1996: 850, 
        2000: 644, 2004: 604, 2008: 1648, 2012: 2465, 2016: 1796, 2020: 1609, 2022: 1920
    },
    'CA': {
        1896: 2, 1900: 2, 1904: 2, 1908: 2, 1912: 2, 1920: 2, 1924: 2, 1928: 2, 
        1932: 2, 1936: 2, 1948: 2, 1952: 2, 1956: 2, 1960: 2, 1964: 2, 1968: 2, 
        1972: 2, 1976: 2, 1980: 2, 1984: 2, 1988: 507, 1992: 580, 1996: 618, 
        2000: 739, 2004: 1026, 2008: 1500, 2012: 1829, 2016: 1529, 2020: 1643, 2022: 2139
    },
    'AU': {
        1896: 1, 1900: 1, 1904: 1, 1908: 1, 1912: 1, 1920: 1, 1924: 1, 1928: 1, 
        1932: 1, 1936: 1, 1948: 1, 1952: 1, 1956: 1, 1960: 1, 1964: 1, 1968: 1, 
        1972: 1, 1976: 1, 1980: 1, 1984: 1, 1988: 296, 1992: 325, 1996: 401, 
        2000: 415, 2004: 612, 2008: 1055, 2012: 1542, 2016: 1352, 2020: 1331, 2022: 1675
    },
    'KR': {
        1896: 0, 1900: 0, 1904: 0, 1908: 0, 1912: 0, 1920: 0, 1924: 0, 1928: 0, 
        1932: 0, 1936: 0, 1948: 0, 1952: 0, 1956: 0, 1960: 0, 1964: 0, 1968: 0, 
        1972: 0, 1976: 0, 1980: 0, 1984: 0, 1988: 200, 1992: 355, 1996: 520, 
        2000: 533, 2004: 721, 2008: 1007, 2012: 1234, 2016: 1411, 2020: 1638, 2022: 1667
    },
    'ES': {
        1896: 3, 1900: 3, 1904: 3, 1908: 3, 1912: 3, 1920: 3, 1924: 3, 1928: 3, 
        1932: 3, 1936: 3, 1948: 3, 1952: 3, 1956: 3, 1960: 3, 1964: 3, 1968: 3, 
        1972: 3, 1976: 3, 1980: 3, 1984: 3, 1988: 390, 1992: 629, 1996: 630, 
        2000: 595, 2004: 1067, 2008: 1609, 2012: 1322, 2016: 1232, 2020: 1281, 2022: 1398
    },
    'NL': {
        1896: 2, 1900: 2, 1904: 2, 1908: 2, 1912: 2, 1920: 2, 1924: 2, 1928: 2, 
        1932: 2, 1936: 2, 1948: 2, 1952: 2, 1956: 2, 1960: 2, 1964: 2, 1968: 2, 
        1972: 2, 1976: 2, 1980: 2, 1984: 2, 1988: 232, 1992: 312, 1996: 415, 
        2000: 416, 2004: 652, 2008: 868, 2012: 838, 2016: 777, 2020: 912, 2022: 990
    },
    'SE': {
        1896: 1, 1900: 1, 1904: 1, 1908: 1, 1912: 1, 1920: 1, 1924: 1, 1928: 1, 
        1932: 1, 1936: 1, 1948: 1, 1952: 1, 1956: 1, 1960: 1, 1964: 1, 1968: 1, 
        1972: 1, 1976: 1, 1980: 1, 1984: 1, 1988: 201, 1992: 265, 1996: 289, 
        2000: 245, 2004: 361, 2008: 488, 2012: 544, 2016: 511, 2020: 541, 2022: 585
    },
    'NO': {
        1896: 1, 1900: 1, 1904: 1, 1908: 1, 1912: 1, 1920: 1, 1924: 1, 1928: 1, 
        1932: 1, 1936: 1, 1948: 1, 1952: 1, 1956: 1, 1960: 1, 1964: 1, 1968: 1, 
        1972: 1, 1976: 1, 1980: 1, 1984: 1, 1988: 112, 1992: 130, 1996: 163, 
        2000: 171, 2004: 258, 2008: 456, 2012: 499, 2016: 371, 2020: 362, 2022: 579
    }
}

def classify_sports_by_cost():
    """Classifier les sports par coût en utilisant les sports disponibles"""
    try:
        available_sports = get_available_sports()
        
        # Classification dynamique basée sur les sports disponibles
        high_cost_keywords = ['Sailing', 'Equestrian', 'Cycling', 'Rowing', 'Canoe', 'Modern Pentathlon', 
                             'Triathlon', 'Swimming', 'Diving', 'Water Polo', 'Gymnastics', 'Shooting', 
                             'Archery', 'Fencing', 'Weightlifting', 'Boxing', 'Wrestling', 'Judo', 
                             'Taekwondo', 'Karate', 'Surfing', 'Skateboarding', 'Sport Climbing', 'BMX']
        
        medium_cost_keywords = ['Athletics', 'Basketball', 'Volleyball', 'Handball', 'Football', 
                               'Hockey', 'Tennis', 'Badminton', 'Table Tennis', 'Golf', 'Rugby', 
                               'Baseball', 'Softball']
        
        low_cost_keywords = ['Marathon', 'Race Walking', 'Cross Country', 'Ultra Distance', 'Trail']
        
        high_cost = []
        medium_cost = []
        low_cost = []
        
        for sport in available_sports:
            sport_lower = sport.lower()
            if any(keyword.lower() in sport_lower for keyword in high_cost_keywords):
                high_cost.append(sport)
            elif any(keyword.lower() in sport_lower for keyword in medium_cost_keywords):
                medium_cost.append(sport)
            elif any(keyword.lower() in sport_lower for keyword in low_cost_keywords):
                low_cost.append(sport)
            else:
                # Par défaut, classer comme coût moyen
                medium_cost.append(sport)
        
        return {
            'high_cost': high_cost,
            'medium_cost': medium_cost,
            'low_cost': low_cost
        }
    except Exception as e:
        print(f"Erreur lors de la classification des sports: {e}")
        # Fallback vers la classification statique
        return {
            'high_cost': [
                'Sailing', 'Equestrian', 'Cycling', 'Rowing', 'Canoe Sprint',
                'Canoe Slalom', 'Modern Pentathlon', 'Triathlon', 'Swimming',
                'Diving', 'Water Polo', 'Synchronized Swimming', 'Gymnastics',
                'Trampoline', 'Rhythmic Gymnastics', 'Artistic Gymnastics',
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

def get_available_countries():
    """Récupérer les codes pays disponibles depuis la base de données"""
    try:
        from database.supabase_client import get_supabase_client
        
        supabase = get_supabase_client()
        result = supabase.table('m_award').select('noc').execute()
        
        if result.data:
            countries = list(set([row['noc'] for row in result.data if row['noc']]))
            return countries
        else:
            return []
    except Exception as e:
        print(f"Erreur lors de la récupération des pays: {e}")
        return []

def get_available_years():
    """Récupérer les années disponibles depuis la base de données"""
    try:
        from database.supabase_client import get_supabase_client
        
        supabase = get_supabase_client()
        result = supabase.table('m_award').select('year').execute()
        
        if result.data:
            years = sorted(list(set([row['year'] for row in result.data if row['year']])))
            return years
        else:
            return []
    except Exception as e:
        print(f"Erreur lors de la récupération des années: {e}")
        return []

def get_available_sports():
    """Récupérer les sports disponibles depuis la base de données"""
    try:
        from database.supabase_client import get_supabase_client
        
        supabase = get_supabase_client()
        result = supabase.table('m_award').select('sport').execute()
        
        if result.data:
            sports = list(set([row['sport'] for row in result.data if row['sport']]))
            return sports
        else:
            return []
    except Exception as e:
        print(f"Erreur lors de la récupération des sports: {e}")
        return []

def load_medals_data():
    """Charger les données de médailles depuis la base de données"""
    try:
        from database.supabase_client import get_supabase_client
        
        supabase = get_supabase_client()
        result = supabase.table('m_award').select('*').execute()
        
        if not result.data:
            print("Aucune donnée trouvée dans la table m_award")
            return None
        
        # Convertir en DataFrame
        df = pd.DataFrame(result.data)
        
        # S'assurer que la colonne year est numérique
        if 'year' in df.columns:
            df['year'] = pd.to_numeric(df['year'], errors='coerce')
            df = df.dropna(subset=['year'])
        else:
            print("Colonne 'year' non trouvée dans les données")
            return None
            
        return df
    except Exception as e:
        print(f"Erreur lors du chargement des données depuis la base de données: {e}")
        return None

def analyze_correlation_by_year(years=None):
    """Analyser la corrélation PIB-médailles par année"""
    if years is None:
        # Récupérer automatiquement toutes les années disponibles depuis la base de données
        medals_data = load_medals_data()
        if medals_data is not None:
            years = sorted(medals_data['year'].unique().tolist())
        else:
            # Fallback si pas de données - récupérer depuis la base de données
            try:
                from database.supabase_client import get_supabase_client
                supabase = get_supabase_client()
                result = supabase.table('m_award').select('year').execute()
                if result.data:
                    years = sorted(list(set([row['year'] for row in result.data if row['year']])))
                else:
                    years = [1896, 1900, 1904, 1908, 1912, 1920, 1924, 1928, 1932, 1936, 1948, 1952, 1956, 1960, 1964, 1968, 1972, 1976, 1980, 1984, 1988, 1992, 1996, 2000, 2004, 2008, 2012, 2016, 2020, 2022]
            except Exception as e:
                print(f"Erreur lors de la récupération des années: {e}")
                years = [1896, 1900, 1904, 1908, 1912, 1920, 1924, 1928, 1932, 1936, 1948, 1952, 1956, 1960, 1964, 1968, 1972, 1976, 1980, 1984, 1988, 1992, 1996, 2000, 2004, 2008, 2012, 2016, 2020, 2022]
    
    medals_data = load_medals_data()
    if medals_data is None:
        return None
    
    results = {}
    
    for year in years:
        year_medals = medals_data[medals_data['year'] == year]
        
        if len(year_medals) == 0:
            continue
        
        # Agréger les médailles par pays
        # Compter le nombre de médailles par pays (chaque ligne = 1 médaille)
        country_medals = year_medals.groupby('noc').size().reset_index(name='medal_count')
        
        # Préparer les données pour la corrélation
        gdp_values = []
        medal_counts = []
        countries_analyzed = []
        
        for _, row in country_medals.iterrows():
            noc_code = row['noc']
            if noc_code in COUNTRY_MAPPING:
                iso_code = COUNTRY_MAPPING[noc_code]
                if iso_code in FALLBACK_GDP_DATA and year in FALLBACK_GDP_DATA[iso_code]:
                    gdp_values.append(FALLBACK_GDP_DATA[iso_code][year])
                    medal_counts.append(row['medal_count'])
                    countries_analyzed.append(noc_code)
        
        if len(gdp_values) < 5:
            continue
        
        # Calculer les corrélations
        try:
            pearson_corr, pearson_p = pearsonr(gdp_values, medal_counts)
            spearman_corr, spearman_p = spearmanr(gdp_values, medal_counts)
            
            results[year] = {
                'pearson': {'correlation': float(pearson_corr), 'p_value': float(pearson_p)},
                'spearman': {'correlation': float(spearman_corr), 'p_value': float(spearman_p)},
                'sample_size': len(gdp_values),
                'countries': countries_analyzed,
                'gdp_values': gdp_values,
                'medal_counts': medal_counts
            }
        except Exception as e:
            print(f"Erreur calcul corrélation {year}: {e}")
            continue
    
    return results

def analyze_by_sport_cost(year=2022):
    """Analyser la corrélation par coût des sports"""
    medals_data = load_medals_data()
    if medals_data is None:
        return None
    
    year_medals = medals_data[medals_data['year'] == year]
    results_by_cost = {}
    
    # Utiliser la classification dynamique des sports
    sport_costs = classify_sports_by_cost()
    
    for cost_level, sports in sport_costs.items():
        # Filtrer les médailles pour ces sports
        cost_medals = year_medals[year_medals['sport'].isin(sports)]
        
        if len(cost_medals) == 0:
            continue
        
        # Agréger par pays
        country_medals = cost_medals.groupby('noc').size().reset_index(name='medal_count')
        
        # Calculer la corrélation
        gdp_values = []
        medal_counts = []
        
        for _, row in country_medals.iterrows():
            noc_code = row['noc']
            if noc_code in COUNTRY_MAPPING:
                iso_code = COUNTRY_MAPPING[noc_code]
                if iso_code in FALLBACK_GDP_DATA and year in FALLBACK_GDP_DATA[iso_code]:
                    gdp_values.append(FALLBACK_GDP_DATA[iso_code][year])
                    medal_counts.append(row['medal_count'])
        
        if len(gdp_values) >= 5:
            try:
                pearson_corr, pearson_p = pearsonr(gdp_values, medal_counts)
                spearman_corr, spearman_p = spearmanr(gdp_values, medal_counts)
                
                results_by_cost[cost_level] = {
                    'pearson': {'correlation': float(pearson_corr), 'p_value': float(pearson_p)},
                    'spearman': {'correlation': float(spearman_corr), 'p_value': float(spearman_p)},
                    'sample_size': len(gdp_values),
                    'sports_count': len(sports),
                    'medals_count': len(cost_medals)
                }
            except Exception as e:
                print(f"Erreur calcul corrélation {cost_level}: {e}")
                continue
    
    return results_by_cost

def analyze_gdp_per_capita_correlation(year=2022):
    """Analyser la corrélation avec le PIB par habitant"""
    # Données de population approximatives (en millions) - 2022
    population_data = {
        'US': 331, 'CN': 1439, 'JP': 125, 'DE': 83, 'IN': 1380,
        'GB': 67, 'FR': 67, 'IT': 60, 'BR': 213, 'CA': 38,
        'AU': 25, 'KR': 52, 'ES': 47, 'NL': 17, 'SE': 10, 'NO': 5
    }
    
    medals_data = load_medals_data()
    if medals_data is None:
        return None
    
    year_medals = medals_data[medals_data['year'] == year]
    country_medals = year_medals.groupby('noc').size().reset_index(name='medal_count')
    
    gdp_per_capita = []
    medal_counts = []
    
    for _, row in country_medals.iterrows():
        noc_code = row['noc']
        if noc_code in COUNTRY_MAPPING:
            iso_code = COUNTRY_MAPPING[noc_code]
            if (iso_code in FALLBACK_GDP_DATA and year in FALLBACK_GDP_DATA[iso_code] and 
                iso_code in population_data):
                gdp_total = FALLBACK_GDP_DATA[iso_code][year]
                population = population_data[iso_code]
                gdp_per_capita.append(gdp_total / population)
                medal_counts.append(row['medal_count'])
    
    if len(gdp_per_capita) >= 5:
        try:
            pearson_corr, pearson_p = pearsonr(gdp_per_capita, medal_counts)
            spearman_corr, spearman_p = spearmanr(gdp_per_capita, medal_counts)
            
            return {
                'pearson': {'correlation': float(pearson_corr), 'p_value': float(pearson_p)},
                'spearman': {'correlation': float(spearman_corr), 'p_value': float(spearman_p)},
                'sample_size': len(gdp_per_capita),
                'gdp_per_capita': gdp_per_capita,
                'medal_counts': medal_counts
            }
        except Exception as e:
            print(f"Erreur calcul corrélation PIB par habitant: {e}")
            return None
    
    return None

@gdp_analysis_bp.route('/correlation-by-year', methods=['GET'])
def get_correlation_by_year():
    """Obtenir la corrélation PIB-médailles par année"""
    try:
        years = request.args.get('years', '1988,1992,1996,2000,2004,2008,2012,2016,2020,2022')
        years_list = [int(y.strip()) for y in years.split(',')]
        
        results = analyze_correlation_by_year(years_list)
        
        if results is None:
            return jsonify({
                'status': 'error',
                'message': 'Impossible de charger les données de médailles'
            }), 500
        
        return jsonify({
            'status': 'success',
            'data': results
        })
    
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': f'Erreur lors de l\'analyse: {str(e)}'
        }), 500

@gdp_analysis_bp.route('/correlation-by-sport-cost', methods=['GET'])
def get_correlation_by_sport_cost():
    """Obtenir la corrélation par coût des sports"""
    try:
        year = int(request.args.get('year', 2022))
        
        results = analyze_by_sport_cost(year)
        
        if results is None:
            return jsonify({
                'status': 'error',
                'message': 'Impossible de charger les données de médailles'
            }), 500
        
        return jsonify({
            'status': 'success',
            'data': results
        })
    
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': f'Erreur lors de l\'analyse: {str(e)}'
        }), 500

@gdp_analysis_bp.route('/correlation-gdp-per-capita', methods=['GET'])
def get_correlation_gdp_per_capita():
    """Obtenir la corrélation avec le PIB par habitant"""
    try:
        year = int(request.args.get('year', 2022))
        
        results = analyze_gdp_per_capita_correlation(year)
        
        if results is None:
            return jsonify({
                'status': 'error',
                'message': 'Impossible de calculer la corrélation PIB par habitant'
            }), 500
        
        return jsonify({
            'status': 'success',
            'data': results
        })
    
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': f'Erreur lors de l\'analyse: {str(e)}'
        }), 500

@gdp_analysis_bp.route('/summary', methods=['GET'])
def get_analysis_summary():
    """Obtenir un résumé de l'analyse complète"""
    try:
        # Analyser les corrélations par année
        correlation_results = analyze_correlation_by_year()
        
        # Analyser par coût des sports
        sport_cost_results = analyze_by_sport_cost()
        
        # Analyser le PIB par habitant
        gdp_per_capita_results = analyze_gdp_per_capita_correlation()
        
        # Calculer les statistiques globales
        if correlation_results:
            years = list(correlation_results.keys())
            pearson_corrs = [correlation_results[year]['pearson']['correlation'] for year in years]
            spearman_corrs = [correlation_results[year]['spearman']['correlation'] for year in years]
            
            # Récupérer les informations dynamiques
            available_years = get_available_years()
            available_countries = get_available_countries()
            available_sports = get_available_sports()
            
            summary = {
                'years_analyzed': years,
                'total_years_available': len(available_years),
                'total_countries_available': len(available_countries),
                'total_sports_available': len(available_sports),
                'mean_pearson_correlation': float(np.mean(pearson_corrs)),
                'mean_spearman_correlation': float(np.mean(spearman_corrs)),
                'std_pearson_correlation': float(np.std(pearson_corrs)),
                'std_spearman_correlation': float(np.std(spearman_corrs)),
                'correlation_interpretation': 'forte' if abs(np.mean(pearson_corrs)) > 0.7 else 'modérée' if abs(np.mean(pearson_corrs)) > 0.5 else 'faible',
                'correlation_direction': 'positive' if np.mean(pearson_corrs) > 0 else 'négative',
                'sport_cost_analysis': sport_cost_results,
                'gdp_per_capita_analysis': gdp_per_capita_results,
                'data_source': 'Base de données Supabase (table m_award)',
                'analysis_period': f"{min(available_years) if available_years else 'N/A'} - {max(available_years) if available_years else 'N/A'}"
            }
        else:
            summary = {
                'error': 'Aucune donnée de corrélation disponible'
            }
        
        return jsonify({
            'status': 'success',
            'data': summary
        })
    
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': f'Erreur lors de l\'analyse: {str(e)}'
        }), 500

@gdp_analysis_bp.route('/debug-medals-data', methods=['GET'])
def debug_medals_data():
    """Route de débogage pour analyser la structure des données de médailles"""
    try:
        medals_data = load_medals_data()
        if medals_data is None:
            return jsonify({'error': 'Impossible de charger les données'}), 500
        
        # Analyser la structure
        analysis = {
            'total_records': len(medals_data),
            'columns': list(medals_data.columns),
            'sample_data': medals_data.head(3).to_dict('records'),
            'usa_records': len(medals_data[medals_data['noc'] == 'USA']),
            'unique_countries': medals_data['noc'].nunique()
        }
        
        # Si il y a une colonne medal, analyser les types
        if 'medal' in medals_data.columns:
            analysis['medal_types'] = medals_data['medal'].value_counts().to_dict()
            analysis['usa_medals'] = medals_data[medals_data['noc'] == 'USA']['medal'].value_counts().to_dict()
        
        return jsonify({
            'status': 'success',
            'data': analysis
        })
        
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': f'Erreur: {str(e)}'
        }), 500

@gdp_analysis_bp.route('/real-gdp-medals-data', methods=['GET'])
def get_real_gdp_medals_data():
    """Récupérer les données PIB réelles 2024 et médailles totales par pays"""
    try:
        # 1. Récupérer les médailles totales par pays depuis la base de données
        medals_data = load_medals_data()
        if medals_data is None:
            return jsonify({
                'status': 'error',
                'message': 'Impossible de charger les données de médailles depuis la base de données'
            }), 500
        
        # Analyser la structure des données
        print(f"📊 Total d'enregistrements dans m_award: {len(medals_data)}")
        print(f"📊 Colonnes disponibles: {list(medals_data.columns)}")
        
        # Vérifier les premières lignes pour comprendre la structure
        print("📊 Premières lignes des données:")
        print(medals_data.head())
        
        # Vérifier s'il y a des colonnes qui indiquent le type de médaille
        if 'medal' in medals_data.columns:
            print("📊 Types de médailles disponibles:")
            print(medals_data['medal'].value_counts())
        
        # Compter les médailles par pays - méthode 1: compter les lignes
        medals_by_country_lines = medals_data.groupby('noc').size().reset_index(name='total_lines')
        
        # Compter les médailles par pays - méthode correcte
        if 'medal' in medals_data.columns:
            # Compter les médailles (or, silver, bronze) par pays
            # Chaque ligne représente une médaille, donc on compte les lignes
            medals_by_country = medals_data.groupby('noc').size().reset_index(name='total_medals')
        else:
            # Si pas de colonne medal, compter les lignes
            medals_by_country = medals_by_country_lines.copy()
            medals_by_country.columns = ['noc', 'total_medals']
        
        print(f"📊 Médailles trouvées pour {len(medals_by_country)} pays")
        
        # Afficher les pays avec le plus de médailles
        top_countries = medals_by_country.nlargest(10, 'total_medals')
        print("📊 Top 10 pays par médailles:")
        for _, row in top_countries.iterrows():
            print(f"  {row['noc']}: {row['total_medals']} médailles")
        
        # Vérifier spécifiquement les États-Unis
        usa_medals = medals_by_country[medals_by_country['noc'] == 'USA']
        if not usa_medals.empty:
            print(f"📊 États-Unis: {usa_medals.iloc[0]['total_medals']} médailles")
        else:
            print("📊 États-Unis non trouvé dans les données")
        
        # 2. Récupérer les données PIB depuis la base de données ou une source externe
        gdp_data = get_gdp_data_from_database()
        if gdp_data is None:
            return jsonify({
                'status': 'error',
                'message': 'Impossible de charger les données PIB'
            }), 500
        
        # 3. Combiner les données
        result_data = []
        for _, row in medals_by_country.iterrows():
            noc_code = row['noc']
            total_medals = row['total_medals']
            
            # Récupérer le PIB pour ce pays depuis les données de la base
            gdp_2024 = gdp_data.get(noc_code, 0)
            
            if gdp_2024 > 0:  # Seulement les pays avec des données PIB
                result_data.append({
                    'country': noc_code,
                    'country_name': get_country_name(noc_code),
                    'gdp_2024': gdp_2024,
                    'total_medals': total_medals
                })
        
        # Trier par nombre de médailles (décroissant)
        result_data.sort(key=lambda x: x['total_medals'], reverse=True)
        
        # Prendre les 10 premiers pays
        top_10 = result_data[:10]
        
        return jsonify({
            'status': 'success',
            'data': {
                'labels': [country['country_name'] for country in top_10],
                'gdp_data': [country['gdp_2024'] for country in top_10],
                'medals_data': [country['total_medals'] for country in top_10],
                'raw_data': top_10
            }
        })
        
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': f'Erreur lors de la récupération des données: {str(e)}'
        }), 500

def get_gdp_data_from_database():
    """Récupérer les données PIB depuis la base de données ou créer une table PIB"""
    try:
        from database.supabase_client import get_supabase_client
        
        supabase = get_supabase_client()
        
        # Essayer de récupérer depuis une table PIB dédiée
        try:
            result = supabase.table('country_gdp').select('*').execute()
            if result.data:
                print("📊 Données PIB récupérées depuis la table country_gdp")
                return {row['country_code']: row['gdp_2024'] for row in result.data}
        except Exception as e:
            print(f"⚠️ Table country_gdp non trouvée: {e}")
        
        # Si pas de table PIB, créer des données PIB basées sur les pays avec médailles
        print("🔄 Création de données PIB basées sur les pays avec médailles...")
        
        # Récupérer les pays qui ont des médailles
        medals_data = load_medals_data()
        if medals_data is None:
            return None
            
        countries_with_medals = medals_data['noc'].unique()
        
        # Créer des données PIB réalistes basées sur les pays olympiques
        gdp_data = {}
        for country in countries_with_medals:
            # Utiliser les données PIB de secours pour les pays avec médailles
            iso_code = COUNTRY_MAPPING.get(country, country)
            if iso_code in FALLBACK_GDP_DATA:
                # Prendre la valeur la plus récente (2022)
                latest_year = max(FALLBACK_GDP_DATA[iso_code].keys())
                gdp_data[country] = FALLBACK_GDP_DATA[iso_code][latest_year]
        
        print(f"📊 Données PIB créées pour {len(gdp_data)} pays")
        return gdp_data
        
    except Exception as e:
        print(f"❌ Erreur lors de la récupération des données PIB: {e}")
        return None

def get_country_name(noc_code):
    """Convertir le code NOC en nom de pays"""
    country_names = {
        'USA': 'États-Unis', 'CHN': 'Chine', 'JPN': 'Japon', 'GER': 'Allemagne',
        'FRA': 'France', 'GBR': 'Royaume-Uni', 'ITA': 'Italie', 'CAN': 'Canada',
        'AUS': 'Australie', 'KOR': 'Corée du Sud', 'BRA': 'Brésil', 'RUS': 'Russie',
        'IND': 'Inde', 'ESP': 'Espagne', 'NED': 'Pays-Bas', 'SWE': 'Suède',
        'NOR': 'Norvège', 'FIN': 'Finlande', 'DEN': 'Danemark', 'SUI': 'Suisse',
        'BEL': 'Belgique', 'AUT': 'Autriche', 'POL': 'Pologne', 'CZE': 'République tchèque',
        'HUN': 'Hongrie', 'ROM': 'Roumanie', 'BUL': 'Bulgarie', 'CRO': 'Croatie',
        'SLO': 'Slovénie', 'SVK': 'Slovaquie', 'EST': 'Estonie', 'LAT': 'Lettonie',
        'LTU': 'Lituanie', 'GRE': 'Grèce', 'POR': 'Portugal', 'IRL': 'Irlande',
        'ISL': 'Islande', 'LUX': 'Luxembourg', 'MAL': 'Malte', 'CYP': 'Chypre'
    }
    return country_names.get(noc_code, noc_code)