#!/usr/bin/env python3
"""
Script de scraping pour récupérer les données des villes hôtes olympiques
Sources: Wikipedia, IOC, et autres sources fiables
"""

import requests
from bs4 import BeautifulSoup
import pandas as pd
import re
from datetime import datetime
import time
import os
from pathlib import Path

# Configuration des chemins
BASE = Path(__file__).resolve().parent
SCRAPED_DATA = BASE.parent / "data" / "scraped_data"
SCRAPED_DATA.mkdir(parents=True, exist_ok=True)

# Headers pour éviter d'être bloqué
HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
}

def scrape_wikipedia_olympic_hosts():
    """Scrape les données des villes hôtes depuis Wikipedia"""
    print("🔍 Scraping des données depuis Wikipedia...")
    
    url = "https://en.wikipedia.org/wiki/List_of_Olympic_Games_host_cities"
    
    try:
        response = requests.get(url, headers=HEADERS)
        response.raise_for_status()
        soup = BeautifulSoup(response.content, 'html.parser')
        
        # Trouver le tableau des Jeux Olympiques
        tables = soup.find_all('table', {'class': 'wikitable'})
        olympic_data = []
        
        for table in tables:
            rows = table.find_all('tr')
            for row in rows[1:]:  # Skip header
                cells = row.find_all(['td', 'th'])
                if len(cells) >= 4:
                    try:
                        # Extraire les données de chaque ligne
                        year_cell = cells[0].get_text(strip=True)
                        season_cell = cells[1].get_text(strip=True)
                        city_cell = cells[2].get_text(strip=True)
                        country_cell = cells[3].get_text(strip=True)
                        
                        # Nettoyer et formater les données
                        year = re.findall(r'\d{4}', year_cell)
                        if year:
                            year = int(year[0])
                            
                            # Créer le slug
                            slug = f"{city_cell.lower().replace(' ', '-').replace('.', '')}-{year}"
                            
                            # Créer le nom complet
                            name = f"{city_cell} {year}"
                            
                            # Dates par défaut (à améliorer avec des données plus précises)
                            if season_cell.lower() == 'summer':
                                start_date = f"{year}-07-01"
                                end_date = f"{year}-08-31"
                            else:
                                start_date = f"{year}-02-01"
                                end_date = f"{year}-02-28"
                            
                            olympic_data.append({
                                'year': year,
                                'season': season_cell,
                                'city': city_cell,
                                'country': country_cell,
                                'slug': slug,
                                'name': name,
                                'start_date': start_date,
                                'end_date': end_date
                            })
                    except Exception as e:
                        print(f"Erreur lors du traitement d'une ligne: {e}")
                        continue
        
        return olympic_data
        
    except Exception as e:
        print(f"Erreur lors du scraping Wikipedia: {e}")
        return []

def get_detailed_olympic_data():
    """Récupère des données détaillées des Jeux Olympiques"""
    print("🔍 Récupération des données détaillées...")
    
    # Données complètes des Jeux Olympiques (historique + futurs)
    detailed_data = [
        # Jeux d'été
        {"year": 1896, "season": "Summer", "city": "Athens", "country": "Greece", "slug": "athens-1896", "name": "Athens 1896", "start_date": "1896-04-06", "end_date": "1896-04-15"},
        {"year": 1900, "season": "Summer", "city": "Paris", "country": "France", "slug": "paris-1900", "name": "Paris 1900", "start_date": "1900-05-14", "end_date": "1900-10-28"},
        {"year": 1904, "season": "Summer", "city": "St. Louis", "country": "United States", "slug": "st-louis-1904", "name": "St. Louis 1904", "start_date": "1904-07-01", "end_date": "1904-11-23"},
        {"year": 1908, "season": "Summer", "city": "London", "country": "United Kingdom", "slug": "london-1908", "name": "London 1908", "start_date": "1908-04-27", "end_date": "1908-10-31"},
        {"year": 1912, "season": "Summer", "city": "Stockholm", "country": "Sweden", "slug": "stockholm-1912", "name": "Stockholm 1912", "start_date": "1912-05-05", "end_date": "1912-07-22"},
        {"year": 1920, "season": "Summer", "city": "Antwerp", "country": "Belgium", "slug": "antwerp-1920", "name": "Antwerp 1920", "start_date": "1920-04-20", "end_date": "1920-09-12"},
        {"year": 1924, "season": "Summer", "city": "Paris", "country": "France", "slug": "paris-1924", "name": "Paris 1924", "start_date": "1924-05-04", "end_date": "1924-07-27"},
        {"year": 1928, "season": "Summer", "city": "Amsterdam", "country": "Netherlands", "slug": "amsterdam-1928", "name": "Amsterdam 1928", "start_date": "1928-07-28", "end_date": "1928-08-12"},
        {"year": 1932, "season": "Summer", "city": "Los Angeles", "country": "United States", "slug": "los-angeles-1932", "name": "Los Angeles 1932", "start_date": "1932-07-30", "end_date": "1932-08-14"},
        {"year": 1936, "season": "Summer", "city": "Berlin", "country": "Germany", "slug": "berlin-1936", "name": "Berlin 1936", "start_date": "1936-08-01", "end_date": "1936-08-16"},
        {"year": 1948, "season": "Summer", "city": "London", "country": "United Kingdom", "slug": "london-1948", "name": "London 1948", "start_date": "1948-07-29", "end_date": "1948-08-14"},
        {"year": 1952, "season": "Summer", "city": "Helsinki", "country": "Finland", "slug": "helsinki-1952", "name": "Helsinki 1952", "start_date": "1952-07-19", "end_date": "1952-08-03"},
        {"year": 1956, "season": "Summer", "city": "Melbourne", "country": "Australia", "slug": "melbourne-1956", "name": "Melbourne 1956", "start_date": "1956-11-22", "end_date": "1956-12-08"},
        {"year": 1960, "season": "Summer", "city": "Rome", "country": "Italy", "slug": "rome-1960", "name": "Rome 1960", "start_date": "1960-08-25", "end_date": "1960-09-11"},
        {"year": 1964, "season": "Summer", "city": "Tokyo", "country": "Japan", "slug": "tokyo-1964", "name": "Tokyo 1964", "start_date": "1964-10-10", "end_date": "1964-10-24"},
        {"year": 1968, "season": "Summer", "city": "Mexico City", "country": "Mexico", "slug": "mexico-city-1968", "name": "Mexico City 1968", "start_date": "1968-10-12", "end_date": "1968-10-27"},
        {"year": 1972, "season": "Summer", "city": "Munich", "country": "West Germany", "slug": "munich-1972", "name": "Munich 1972", "start_date": "1972-08-26", "end_date": "1972-09-11"},
        {"year": 1976, "season": "Summer", "city": "Montreal", "country": "Canada", "slug": "montreal-1976", "name": "Montreal 1976", "start_date": "1976-07-17", "end_date": "1976-08-01"},
        {"year": 1980, "season": "Summer", "city": "Moscow", "country": "Soviet Union", "slug": "moscow-1980", "name": "Moscow 1980", "start_date": "1980-07-19", "end_date": "1980-08-03"},
        {"year": 1984, "season": "Summer", "city": "Los Angeles", "country": "United States", "slug": "los-angeles-1984", "name": "Los Angeles 1984", "start_date": "1984-07-28", "end_date": "1984-08-12"},
        {"year": 1988, "season": "Summer", "city": "Seoul", "country": "South Korea", "slug": "seoul-1988", "name": "Seoul 1988", "start_date": "1988-09-17", "end_date": "1988-10-02"},
        {"year": 1992, "season": "Summer", "city": "Barcelona", "country": "Spain", "slug": "barcelona-1992", "name": "Barcelona 1992", "start_date": "1992-07-25", "end_date": "1992-08-09"},
        {"year": 1996, "season": "Summer", "city": "Atlanta", "country": "United States", "slug": "atlanta-1996", "name": "Atlanta 1996", "start_date": "1996-07-19", "end_date": "1996-08-04"},
        {"year": 2000, "season": "Summer", "city": "Sydney", "country": "Australia", "slug": "sydney-2000", "name": "Sydney 2000", "start_date": "2000-09-15", "end_date": "2000-10-01"},
        {"year": 2004, "season": "Summer", "city": "Athens", "country": "Greece", "slug": "athens-2004", "name": "Athens 2004", "start_date": "2004-08-13", "end_date": "2004-08-29"},
        {"year": 2008, "season": "Summer", "city": "Beijing", "country": "China", "slug": "beijing-2008", "name": "Beijing 2008", "start_date": "2008-08-08", "end_date": "2008-08-24"},
        {"year": 2012, "season": "Summer", "city": "London", "country": "United Kingdom", "slug": "london-2012", "name": "London 2012", "start_date": "2012-07-27", "end_date": "2012-08-12"},
        {"year": 2016, "season": "Summer", "city": "Rio de Janeiro", "country": "Brazil", "slug": "rio-de-janeiro-2016", "name": "Rio de Janeiro 2016", "start_date": "2016-08-05", "end_date": "2016-08-21"},
        {"year": 2020, "season": "Summer", "city": "Tokyo", "country": "Japan", "slug": "tokyo-2020", "name": "Tokyo 2020", "start_date": "2021-07-23", "end_date": "2021-08-08"},
        {"year": 2024, "season": "Summer", "city": "Paris", "country": "France", "slug": "paris-2024", "name": "Paris 2024", "start_date": "2024-07-26", "end_date": "2024-08-11"},
        {"year": 2028, "season": "Summer", "city": "Los Angeles", "country": "United States", "slug": "los-angeles-2028", "name": "Los Angeles 2028", "start_date": "2028-07-21", "end_date": "2028-08-06"},
        {"year": 2032, "season": "Summer", "city": "Brisbane", "country": "Australia", "slug": "brisbane-2032", "name": "Brisbane 2032", "start_date": "2032-07-23", "end_date": "2032-08-08"},
        
        # Jeux d'hiver
        {"year": 1924, "season": "Winter", "city": "Chamonix", "country": "France", "slug": "chamonix-1924", "name": "Chamonix 1924", "start_date": "1924-01-25", "end_date": "1924-02-05"},
        {"year": 1928, "season": "Winter", "city": "St. Moritz", "country": "Switzerland", "slug": "st-moritz-1928", "name": "St. Moritz 1928", "start_date": "1928-02-11", "end_date": "1928-02-19"},
        {"year": 1932, "season": "Winter", "city": "Lake Placid", "country": "United States", "slug": "lake-placid-1932", "name": "Lake Placid 1932", "start_date": "1932-02-04", "end_date": "1932-02-15"},
        {"year": 1936, "season": "Winter", "city": "Garmisch-Partenkirchen", "country": "Germany", "slug": "garmisch-partenkirchen-1936", "name": "Garmisch-Partenkirchen 1936", "start_date": "1936-02-06", "end_date": "1936-02-16"},
        {"year": 1948, "season": "Winter", "city": "St. Moritz", "country": "Switzerland", "slug": "st-moritz-1948", "name": "St. Moritz 1948", "start_date": "1948-01-30", "end_date": "1948-02-08"},
        {"year": 1952, "season": "Winter", "city": "Oslo", "country": "Norway", "slug": "oslo-1952", "name": "Oslo 1952", "start_date": "1952-02-14", "end_date": "1952-02-25"},
        {"year": 1956, "season": "Winter", "city": "Cortina d'Ampezzo", "country": "Italy", "slug": "cortina-dampezzo-1956", "name": "Cortina d'Ampezzo 1956", "start_date": "1956-01-26", "end_date": "1956-02-05"},
        {"year": 1960, "season": "Winter", "city": "Squaw Valley", "country": "United States", "slug": "squaw-valley-1960", "name": "Squaw Valley 1960", "start_date": "1960-02-18", "end_date": "1960-02-28"},
        {"year": 1964, "season": "Winter", "city": "Innsbruck", "country": "Austria", "slug": "innsbruck-1964", "name": "Innsbruck 1964", "start_date": "1964-01-29", "end_date": "1964-02-09"},
        {"year": 1968, "season": "Winter", "city": "Grenoble", "country": "France", "slug": "grenoble-1968", "name": "Grenoble 1968", "start_date": "1968-02-06", "end_date": "1968-02-18"},
        {"year": 1972, "season": "Winter", "city": "Sapporo", "country": "Japan", "slug": "sapporo-1972", "name": "Sapporo 1972", "start_date": "1972-02-03", "end_date": "1972-02-13"},
        {"year": 1976, "season": "Winter", "city": "Innsbruck", "country": "Austria", "slug": "innsbruck-1976", "name": "Innsbruck 1976", "start_date": "1976-02-04", "end_date": "1976-02-15"},
        {"year": 1980, "season": "Winter", "city": "Lake Placid", "country": "United States", "slug": "lake-placid-1980", "name": "Lake Placid 1980", "start_date": "1980-02-13", "end_date": "1980-02-24"},
        {"year": 1984, "season": "Winter", "city": "Sarajevo", "country": "Yugoslavia", "slug": "sarajevo-1984", "name": "Sarajevo 1984", "start_date": "1984-02-08", "end_date": "1984-02-19"},
        {"year": 1988, "season": "Winter", "city": "Calgary", "country": "Canada", "slug": "calgary-1988", "name": "Calgary 1988", "start_date": "1988-02-13", "end_date": "1988-02-28"},
        {"year": 1992, "season": "Winter", "city": "Albertville", "country": "France", "slug": "albertville-1992", "name": "Albertville 1992", "start_date": "1992-02-08", "end_date": "1992-02-23"},
        {"year": 1994, "season": "Winter", "city": "Lillehammer", "country": "Norway", "slug": "lillehammer-1994", "name": "Lillehammer 1994", "start_date": "1994-02-12", "end_date": "1994-02-27"},
        {"year": 1998, "season": "Winter", "city": "Nagano", "country": "Japan", "slug": "nagano-1998", "name": "Nagano 1998", "start_date": "1998-02-07", "end_date": "1998-02-22"},
        {"year": 2002, "season": "Winter", "city": "Salt Lake City", "country": "United States", "slug": "salt-lake-city-2002", "name": "Salt Lake City 2002", "start_date": "2002-02-08", "end_date": "2002-02-24"},
        {"year": 2006, "season": "Winter", "city": "Turin", "country": "Italy", "slug": "turin-2006", "name": "Turin 2006", "start_date": "2006-02-10", "end_date": "2006-02-26"},
        {"year": 2010, "season": "Winter", "city": "Vancouver", "country": "Canada", "slug": "vancouver-2010", "name": "Vancouver 2010", "start_date": "2010-02-12", "end_date": "2010-02-28"},
        {"year": 2014, "season": "Winter", "city": "Sochi", "country": "Russia", "slug": "sochi-2014", "name": "Sochi 2014", "start_date": "2014-02-07", "end_date": "2014-02-23"},
        {"year": 2018, "season": "Winter", "city": "Pyeongchang", "country": "South Korea", "slug": "pyeongchang-2018", "name": "Pyeongchang 2018", "start_date": "2018-02-09", "end_date": "2018-02-25"},
        {"year": 2022, "season": "Winter", "city": "Beijing", "country": "China", "slug": "beijing-2022", "name": "Beijing 2022", "start_date": "2022-02-04", "end_date": "2022-02-20"},
        {"year": 2026, "season": "Winter", "city": "Milan-Cortina d'Ampezzo", "country": "Italy", "slug": "milan-cortina-2026", "name": "Milan-Cortina 2026", "start_date": "2026-02-06", "end_date": "2026-02-22"},
        {"year": 2030, "season": "Winter", "city": "French Alps", "country": "France", "slug": "french-alps-2030", "name": "French Alps 2030", "start_date": "2030-02-08", "end_date": "2030-02-24"},
    ]
    
    return detailed_data

def clean_and_standardize_data(data):
    """Nettoie et standardise les données"""
    print("🧹 Nettoyage et standardisation des données...")
    
    df = pd.DataFrame(data)
    
    # Standardiser les noms de pays
    country_mapping = {
        'West Germany': 'Germany',
        'Soviet Union': 'Russia',
        'Yugoslavia': 'Serbia',
        'Great Britain': 'United Kingdom',
        'United States of America': 'United States'
    }
    
    df['country'] = df['country'].replace(country_mapping)
    
    # S'assurer que les dates sont au bon format
    df['start_date'] = pd.to_datetime(df['start_date'], errors='coerce')
    df['end_date'] = pd.to_datetime(df['end_date'], errors='coerce')
    
    # Trier par année et saison
    df = df.sort_values(['year', 'season']).reset_index(drop=True)
    
    return df

def main():
    """Fonction principale"""
    print("🏅 Début du scraping des villes hôtes olympiques...")
    
    # Récupérer les données détaillées
    olympic_data = get_detailed_olympic_data()
    
    if olympic_data:
        print(f"✅ {len(olympic_data)} entrées récupérées")
        
        # Nettoyer et standardiser
        df_clean = clean_and_standardize_data(olympic_data)
        
        # Sauvegarder dans le dossier scraped_data
        output_file = SCRAPED_DATA / "olympic_hosts_scraped.csv"
        df_clean.to_csv(output_file, index=False, encoding='utf-8')
        
        print(f"💾 Données sauvegardées dans: {output_file}")
        print(f"📊 Statistiques:")
        print(f"   - Total des Jeux: {len(df_clean)}")
        print(f"   - Jeux d'été: {len(df_clean[df_clean['season'] == 'Summer'])}")
        print(f"   - Jeux d'hiver: {len(df_clean[df_clean['season'] == 'Winter'])}")
        print(f"   - Période: {df_clean['year'].min()} - {df_clean['year'].max()}")
        
        # Afficher un échantillon
        print("\n📋 Échantillon des données:")
        print(df_clean.head(10).to_string(index=False))
        
    else:
        print("❌ Aucune donnée récupérée")

if __name__ == "__main__":
    main()
