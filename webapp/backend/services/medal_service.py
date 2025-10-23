"""
Service pour gérer les opérations liées aux médailles
"""
from database.supabase_client import get_supabase_client

class MedalService:
    @staticmethod
    def get_medals(page=1, limit=None, search='', sort_by='', sort_order='asc', filters=None):
        """Récupérer les données de médailles avec filtres et pagination"""
        try:
            supabase = get_supabase_client()
            
            # Construire la requête de base
            query = supabase.table('m_award').select('*', count='exact')
            
            # Appliquer les filtres
            if filters:
                if 'country' in filters:
                    query = query.eq('noc', filters['country'])
                if 'medal_type' in filters:
                    query = query.eq('medal', filters['medal_type'])
                if 'year' in filters:
                    query = query.eq('year', filters['year'])
                if 'sport' in filters:
                    query = query.eq('sport', filters['sport'])
                if 'year_min' in filters:
                    query = query.gte('year', filters['year_min'])
                if 'year_max' in filters:
                    query = query.lte('year', filters['year_max'])
            
            # Appliquer la recherche
            if search:
                query = query.or_(f'noc.ilike.%{search}%,sport.ilike.%{search}%')
            
            # Appliquer le tri
            if sort_by:
                order = f'{sort_by}.{sort_order}'
                query = query.order(order)
            else:
                query = query.order('year.desc')
            
            # Appliquer la pagination seulement si limit est spécifié
            if limit is not None:
                offset = (page - 1) * limit
                query = query.range(offset, offset + limit - 1)
            # Si limit n'est pas spécifié, on retourne tous les résultats
            
            result = query.execute()
            
            return {
                'status': 'success',
                'data': result.data,
                'total': result.count,
                'page': page,
                'limit': limit,
                'total_pages': (result.count + limit - 1) // limit if result.count and limit else 1
            }
        except Exception as error:
            return {
                'status': 'error',
                'message': str(error)
            }
    
    @staticmethod
    def get_rewards():
        """Récupérer les données de récompenses (table medals)"""
        try:
            supabase = get_supabase_client()
            result = supabase.table('m_award').select('*').execute()
            
            return {
                'status': 'success',
                'data': result.data,
                'count': len(result.data)
            }
        except Exception as error:
            return {
                'status': 'error',
                'message': str(error)
            }
    
    @staticmethod
    def get_france_medals():
        """Calculer les médailles de la France depuis le début des JO"""
        try:
            supabase = get_supabase_client()
            
            # Récupérer toutes les médailles de la France
            result = supabase.table('m_award').select('medal, award_count').eq('noc', 'FRA').execute()
            
            if not result.data:
                return {
                    'status': 'success',
                    'data': {
                        'total_medals': 0,
                        'gold_medals': 0,
                        'silver_medals': 0,
                        'bronze_medals': 0
                    }
                }
            
            # Calculer les totaux par type de médaille
            total_medals = 0
            gold_medals = 0
            silver_medals = 0
            bronze_medals = 0
            
            for medal in result.data:
                medal_type = medal['medal']
                count = medal['award_count']
                total_medals += count
                
                if medal_type == 'GOLD':
                    gold_medals += count
                elif medal_type == 'SILVER':
                    silver_medals += count
                elif medal_type == 'BRONZE':
                    bronze_medals += count
            
            return {
                'status': 'success',
                'data': {
                    'total_medals': total_medals,
                    'gold_medals': gold_medals,
                    'silver_medals': silver_medals,
                    'bronze_medals': bronze_medals
                }
            }
        except Exception as error:
            return {
                'status': 'error',
                'message': str(error)
            }
    
    @staticmethod
    def get_france_success_by_edition():
        """Analyser les succès de la France par édition des JO"""
        try:
            supabase = get_supabase_client()
            
            # Récupérer toutes les médailles de la France avec les années
            result = supabase.table('m_award').select('year, medal, award_count').eq('noc', 'FRA').execute()
            
            if not result.data:
                return {
                    'status': 'success',
                    'data': {
                        'best_edition': None,
                        'worst_edition': None,
                        'editions_data': []
                    }
                }
            
            # Grouper les données par année
            editions_data = {}
            for medal in result.data:
                year = medal['year']
                medal_type = medal['medal']
                count = medal['award_count']
                
                if year not in editions_data:
                    editions_data[year] = {
                        'year': year,
                        'gold': 0,
                        'silver': 0,
                        'bronze': 0,
                        'total': 0
                    }
                
                if medal_type == 'GOLD':
                    editions_data[year]['gold'] += count
                elif medal_type == 'SILVER':
                    editions_data[year]['silver'] += count
                elif medal_type == 'BRONZE':
                    editions_data[year]['bronze'] += count
                
                editions_data[year]['total'] += count
            
            # Convertir en liste et trier par année
            editions_list = list(editions_data.values())
            editions_list.sort(key=lambda x: x['year'])
            
            # Trouver la meilleure et la pire édition
            if editions_list:
                best_edition = max(editions_list, key=lambda x: x['total'])
                worst_edition = min(editions_list, key=lambda x: x['total'])
            else:
                best_edition = None
                worst_edition = None
            
            return {
                'status': 'success',
                'data': {
                    'best_edition': best_edition,
                    'worst_edition': worst_edition,
                    'editions_data': editions_list
                }
            }
        except Exception as error:
            return {
                'status': 'error',
                'message': str(error)
            }
    
    @staticmethod
    def get_france_sport_specialties():
        """Analyser les spécialités sportives de la France"""
        try:
            supabase = get_supabase_client()
            
            # Récupérer toutes les médailles de la France avec les sports
            result = supabase.table('m_award').select('sport, medal, award_count').eq('noc', 'FRA').execute()
            
            if not result.data:
                return {
                    'status': 'success',
                    'data': {
                        'sport_specialties': [],
                        'top_sports': [],
                        'analysis': {}
                    }
                }
            
            # Grouper les données par sport
            sports_data = {}
            for medal in result.data:
                sport = medal['sport']
                medal_type = medal['medal']
                count = medal['award_count']
                
                if sport not in sports_data:
                    sports_data[sport] = {
                        'sport': sport,
                        'gold': 0,
                        'silver': 0,
                        'bronze': 0,
                        'total': 0
                    }
                
                if medal_type == 'GOLD':
                    sports_data[sport]['gold'] += count
                elif medal_type == 'SILVER':
                    sports_data[sport]['silver'] += count
                elif medal_type == 'BRONZE':
                    sports_data[sport]['bronze'] += count
                
                sports_data[sport]['total'] += count
            
            # Convertir en liste et trier par total de médailles
            sports_list = list(sports_data.values())
            sports_list.sort(key=lambda x: x['total'], reverse=True)
            
            # Identifier les spécialités (sports avec le plus de médailles)
            top_sports = sports_list[:5] if len(sports_list) >= 5 else sports_list
            
            # Calculer les statistiques
            total_medals = sum(sport['total'] for sport in sports_list)
            total_sports = len(sports_list)
            
            # Identifier les sports dominants (plus de 10% du total)
            dominant_sports = [sport for sport in sports_list if sport['total'] >= total_medals * 0.1]
            
            return {
                'status': 'success',
                'data': {
                    'sport_specialties': sports_list,
                    'top_sports': top_sports,
                    'dominant_sports': dominant_sports,
                    'analysis': {
                        'total_medals': total_medals,
                        'total_sports': total_sports,
                        'average_medals_per_sport': total_medals / total_sports if total_sports > 0 else 0,
                        'specialization_level': len(dominant_sports) / total_sports if total_sports > 0 else 0
                    }
                }
            }
        except Exception as error:
            return {
                'status': 'error',
                'message': str(error)
            }
    
    @staticmethod
    def get_dominant_sports_evolution():
        """Analyser l'évolution des sports dominants au fil des ans"""
        try:
            supabase = get_supabase_client()
            
            # Récupérer toutes les médailles avec les sports et années
            result = supabase.table('m_award').select('year, sport, medal, award_count').execute()
            
            if not result.data:
                return {
                    'status': 'success',
                    'data': {
                        'sports_evolution': [],
                        'periods_analysis': [],
                        'dominant_sports': []
                    }
                }
            
            # Grouper les données par sport et année
            sports_by_year = {}
            for medal in result.data:
                year = medal['year']
                sport = medal['sport']
                medal_type = medal['medal']
                count = medal['award_count']
                
                if year not in sports_by_year:
                    sports_by_year[year] = {}
                
                if sport not in sports_by_year[year]:
                    sports_by_year[year][sport] = {
                        'sport': sport,
                        'year': year,
                        'gold': 0,
                        'silver': 0,
                        'bronze': 0,
                        'total': 0
                    }
                
                if medal_type == 'GOLD':
                    sports_by_year[year][sport]['gold'] += count
                elif medal_type == 'SILVER':
                    sports_by_year[year][sport]['silver'] += count
                elif medal_type == 'BRONZE':
                    sports_by_year[year][sport]['bronze'] += count
                
                sports_by_year[year][sport]['total'] += count
            
            # Analyser l'évolution par décennies
            decades_analysis = {}
            for year, sports in sports_by_year.items():
                decade = (year // 10) * 10
                if decade not in decades_analysis:
                    decades_analysis[decade] = {}
                
                for sport, data in sports.items():
                    if sport not in decades_analysis[decade]:
                        decades_analysis[decade][sport] = {
                            'sport': sport,
                            'gold': 0,
                            'silver': 0,
                            'bronze': 0,
                            'total': 0,
                            'years': set()
                        }
                    
                    decades_analysis[decade][sport]['gold'] += data['gold']
                    decades_analysis[decade][sport]['silver'] += data['silver']
                    decades_analysis[decade][sport]['bronze'] += data['bronze']
                    decades_analysis[decade][sport]['total'] += data['total']
                    decades_analysis[decade][sport]['years'].add(year)
            
            # Convertir en liste et trier
            periods_analysis = []
            for decade, sports in decades_analysis.items():
                sports_list = []
                for sport, data in sports.items():
                    data['years'] = list(data['years'])
                    data['years_count'] = len(data['years'])
                    sports_list.append(data)
                
                sports_list.sort(key=lambda x: x['total'], reverse=True)
                periods_analysis.append({
                    'decade': decade,
                    'top_sports': sports_list[:5],
                    'total_sports': len(sports_list),
                    'total_medals': sum(sport['total'] for sport in sports_list)
                })
            
            # Identifier les sports les plus dominants globalement
            global_sports = {}
            for year, sports in sports_by_year.items():
                for sport, data in sports.items():
                    if sport not in global_sports:
                        global_sports[sport] = {
                            'sport': sport,
                            'gold': 0,
                            'silver': 0,
                            'bronze': 0,
                            'total': 0,
                            'years': set(),
                            'appearances': 0
                        }
                    
                    global_sports[sport]['gold'] += data['gold']
                    global_sports[sport]['silver'] += data['silver']
                    global_sports[sport]['bronze'] += data['bronze']
                    global_sports[sport]['total'] += data['total']
                    global_sports[sport]['years'].add(year)
                    global_sports[sport]['appearances'] += 1
            
            # Convertir en liste et trier
            dominant_sports = []
            for sport, data in global_sports.items():
                data['years'] = list(data['years'])
                data['years_count'] = len(data['years'])
                data['average_medals_per_year'] = data['total'] / data['years_count'] if data['years_count'] > 0 else 0
                dominant_sports.append(data)
            
            dominant_sports.sort(key=lambda x: x['total'], reverse=True)
            
            # Analyser l'évolution par sport
            sports_evolution = []
            for sport_data in dominant_sports[:10]:  # Top 10 sports
                sport = sport_data['sport']
                evolution = []
                
                for year in sorted(sports_by_year.keys()):
                    if sport in sports_by_year[year]:
                        evolution.append({
                            'year': year,
                            'medals': sports_by_year[year][sport]['total']
                        })
                    else:
                        evolution.append({
                            'year': year,
                            'medals': 0
                        })
                
                sports_evolution.append({
                    'sport': sport,
                    'total_medals': sport_data['total'],
                    'years_active': sport_data['years_count'],
                    'evolution': evolution
                })
            
            return {
                'status': 'success',
                'data': {
                    'sports_evolution': sports_evolution,
                    'periods_analysis': sorted(periods_analysis, key=lambda x: x['decade']),
                    'dominant_sports': dominant_sports[:20],  # Top 20
                    'analysis': {
                        'total_sports': len(global_sports),
                        'total_years': len(sports_by_year),
                        'most_consistent_sport': max(dominant_sports, key=lambda x: x['years_count'])['sport'] if dominant_sports else None,
                        'most_medals_sport': dominant_sports[0]['sport'] if dominant_sports else None
                    }
                }
            }
        except Exception as error:
            return {
                'status': 'error',
                'message': str(error)
            }
    
    @staticmethod
    def get_country_performance_analysis():
        """Analyser les performances par pays - classement global et comparaisons"""
        try:
            supabase = get_supabase_client()
            
            # Récupérer toutes les médailles avec les pays (sans limite)
            result = supabase.table('m_award').select('noc, medal, award_count, year').limit(10000).execute()
            
            if not result.data:
                return {
                    'status': 'success',
                    'data': {
                        'country_rankings': [],
                        'top_countries': [],
                        'performance_evolution': [],
                        'medal_distribution': [],
                        'analysis': {}
                    }
                }
            
            # Grouper les données par pays
            countries_data = {}
            for medal in result.data:
                noc = medal['noc']
                medal_type = medal['medal']
                count = medal['award_count']
                year = medal['year']
                
                if noc not in countries_data:
                    countries_data[noc] = {
                        'country': noc,
                        'gold': 0,
                        'silver': 0,
                        'bronze': 0,
                        'total': 0,
                        'years': set(),
                        'gold_points': 0,
                        'silver_points': 0,
                        'bronze_points': 0,
                        'total_points': 0
                    }
                
                if medal_type == 'GOLD':
                    countries_data[noc]['gold'] += count
                    countries_data[noc]['gold_points'] += count * 3  # Système de points: Or=3, Argent=2, Bronze=1
                elif medal_type == 'SILVER':
                    countries_data[noc]['silver'] += count
                    countries_data[noc]['silver_points'] += count * 2
                elif medal_type == 'BRONZE':
                    countries_data[noc]['bronze'] += count
                    countries_data[noc]['bronze_points'] += count * 1
                
                countries_data[noc]['total'] += count
                countries_data[noc]['total_points'] = countries_data[noc]['gold_points'] + countries_data[noc]['silver_points'] + countries_data[noc]['bronze_points']
                countries_data[noc]['years'].add(year)
            
            # Convertir en liste et trier par différents critères
            countries_list = []
            for country, data in countries_data.items():
                data['years'] = list(data['years'])
                data['years_count'] = len(data['years'])
                data['average_medals_per_year'] = data['total'] / data['years_count'] if data['years_count'] > 0 else 0
                data['average_points_per_year'] = data['total_points'] / data['years_count'] if data['years_count'] > 0 else 0
                countries_list.append(data)
            
            # Classements par différents critères
            ranking_by_medals = sorted(countries_list, key=lambda x: x['total'], reverse=True)
            ranking_by_points = sorted(countries_list, key=lambda x: x['total_points'], reverse=True)
            ranking_by_gold = sorted(countries_list, key=lambda x: x['gold'], reverse=True)
            
            # Top 20 pays
            top_countries = ranking_by_medals[:20]
            
            # Analyser l'évolution des performances par décennies
            decades_performance = {}
            for medal in result.data:
                year = medal['year']
                decade = (year // 10) * 10
                noc = medal['noc']
                medal_type = medal['medal']
                count = medal['award_count']
                
                if decade not in decades_performance:
                    decades_performance[decade] = {}
                
                if noc not in decades_performance[decade]:
                    decades_performance[decade][noc] = {
                        'country': noc,
                        'gold': 0,
                        'silver': 0,
                        'bronze': 0,
                        'total': 0
                    }
                
                if medal_type == 'GOLD':
                    decades_performance[decade][noc]['gold'] += count
                elif medal_type == 'SILVER':
                    decades_performance[decade][noc]['silver'] += count
                elif medal_type == 'BRONZE':
                    decades_performance[decade][noc]['bronze'] += count
                
                decades_performance[decade][noc]['total'] += count
            
            # Convertir l'évolution en format pour les graphiques
            performance_evolution = []
            for decade, countries in decades_performance.items():
                countries_list_decade = list(countries.values())
                countries_list_decade.sort(key=lambda x: x['total'], reverse=True)
                
                performance_evolution.append({
                    'decade': decade,
                    'top_countries': countries_list_decade[:10],
                    'total_countries': len(countries_list_decade),
                    'total_medals': sum(country['total'] for country in countries_list_decade)
                })
            
            # Analyser la distribution des médailles
            medal_distribution = []
            total_medals = sum(country['total'] for country in countries_list)
            for country in ranking_by_medals[:15]:  # Top 15 pour la distribution
                percentage = (country['total'] / total_medals) * 100 if total_medals > 0 else 0
                medal_distribution.append({
                    'country': country['country'],
                    'total_medals': country['total'],
                    'percentage': round(percentage, 2),
                    'gold': country['gold'],
                    'silver': country['silver'],
                    'bronze': country['bronze']
                })
            
            # Statistiques globales
            total_countries = len(countries_list)
            total_medals_global = sum(country['total'] for country in countries_list)
            total_gold = sum(country['gold'] for country in countries_list)
            total_silver = sum(country['silver'] for country in countries_list)
            total_bronze = sum(country['bronze'] for country in countries_list)
            
            # Pays les plus performants par critère
            most_gold_country = max(countries_list, key=lambda x: x['gold']) if countries_list else None
            most_consistent_country = max(countries_list, key=lambda x: x['years_count']) if countries_list else None
            most_efficient_country = max(countries_list, key=lambda x: x['average_medals_per_year']) if countries_list else None
            
            return {
                'status': 'success',
                'data': {
                    'country_rankings': {
                        'by_medals': ranking_by_medals,
                        'by_points': ranking_by_points,
                        'by_gold': ranking_by_gold
                    },
                    'top_countries': top_countries,
                    'performance_evolution': sorted(performance_evolution, key=lambda x: x['decade']),
                    'medal_distribution': medal_distribution,
                    'analysis': {
                        'total_countries': total_countries,
                        'total_medals_global': total_medals_global,
                        'total_gold': total_gold,
                        'total_silver': total_silver,
                        'total_bronze': total_bronze,
                        'most_gold_country': most_gold_country,
                        'most_consistent_country': most_consistent_country,
                        'most_efficient_country': most_efficient_country,
                        'average_medals_per_country': total_medals_global / total_countries if total_countries > 0 else 0
                    }
                }
            }
        except Exception as error:
            return {
                'status': 'error',
                'message': str(error)
            }
    
    @staticmethod
    def get_temporal_trends_analysis():
        """Analyser les tendances temporelles des performances olympiques"""
        try:
            supabase = get_supabase_client()
            
            # Récupérer toutes les médailles avec les années
            result = supabase.table('m_award').select('year, noc, medal, award_count, sport').execute()
            
            if not result.data:
                return {
                    'status': 'success',
                    'data': {
                        'yearly_medals': [],
                        'decade_analysis': [],
                        'country_evolution': [],
                        'sport_evolution': [],
                        'participation_trends': [],
                        'analysis': {}
                    }
                }
            
            # Analyser les médailles par année
            yearly_data = {}
            country_yearly = {}
            sport_yearly = {}
            
            for medal in result.data:
                year = medal['year']
                noc = medal['noc']
                medal_type = medal['medal']
                count = medal['award_count']
                sport = medal['sport']
                
                # Données par année
                if year not in yearly_data:
                    yearly_data[year] = {
                        'year': year,
                        'gold': 0,
                        'silver': 0,
                        'bronze': 0,
                        'total': 0,
                        'countries': set(),
                        'sports': set()
                    }
                
                if medal_type == 'GOLD':
                    yearly_data[year]['gold'] += count
                elif medal_type == 'SILVER':
                    yearly_data[year]['silver'] += count
                elif medal_type == 'BRONZE':
                    yearly_data[year]['bronze'] += count
                
                yearly_data[year]['total'] += count
                yearly_data[year]['countries'].add(noc)
                yearly_data[year]['sports'].add(sport)
                
                # Données par pays et année
                if noc not in country_yearly:
                    country_yearly[noc] = {}
                if year not in country_yearly[noc]:
                    country_yearly[noc][year] = {
                        'year': year,
                        'country': noc,
                        'gold': 0,
                        'silver': 0,
                        'bronze': 0,
                        'total': 0
                    }
                
                if medal_type == 'GOLD':
                    country_yearly[noc][year]['gold'] += count
                elif medal_type == 'SILVER':
                    country_yearly[noc][year]['silver'] += count
                elif medal_type == 'BRONZE':
                    country_yearly[noc][year]['bronze'] += count
                
                country_yearly[noc][year]['total'] += count
                
                # Données par sport et année
                if sport not in sport_yearly:
                    sport_yearly[sport] = {}
                if year not in sport_yearly[sport]:
                    sport_yearly[sport][year] = {
                        'year': year,
                        'sport': sport,
                        'gold': 0,
                        'silver': 0,
                        'bronze': 0,
                        'total': 0
                    }
                
                if medal_type == 'GOLD':
                    sport_yearly[sport][year]['gold'] += count
                elif medal_type == 'SILVER':
                    sport_yearly[sport][year]['silver'] += count
                elif medal_type == 'BRONZE':
                    sport_yearly[sport][year]['bronze'] += count
                
                sport_yearly[sport][year]['total'] += count
            
            # Convertir les données par année
            yearly_medals = []
            for year in sorted(yearly_data.keys()):
                data = yearly_data[year]
                data['countries'] = list(data['countries'])
                data['sports'] = list(data['sports'])
                data['countries_count'] = len(data['countries'])
                data['sports_count'] = len(data['sports'])
                yearly_medals.append(data)
            
            # Analyser par décennies
            decade_analysis = {}
            for year, data in yearly_data.items():
                decade = (year // 10) * 10
                if decade not in decade_analysis:
                    decade_analysis[decade] = {
                        'decade': decade,
                        'gold': 0,
                        'silver': 0,
                        'bronze': 0,
                        'total': 0,
                        'years': set(),
                        'countries': set(),
                        'sports': set()
                    }
                
                decade_analysis[decade]['gold'] += data['gold']
                decade_analysis[decade]['silver'] += data['silver']
                decade_analysis[decade]['bronze'] += data['bronze']
                decade_analysis[decade]['total'] += data['total']
                decade_analysis[decade]['years'].add(year)
                decade_analysis[decade]['countries'].update(data['countries'])
                decade_analysis[decade]['sports'].update(data['sports'])
            
            # Convertir en liste
            decade_list = []
            for decade, data in decade_analysis.items():
                data['years'] = list(data['years'])
                data['countries'] = list(data['countries'])
                data['sports'] = list(data['sports'])
                data['years_count'] = len(data['years'])
                data['countries_count'] = len(data['countries'])
                data['sports_count'] = len(data['sports'])
                data['average_medals_per_year'] = data['total'] / data['years_count'] if data['years_count'] > 0 else 0
                decade_list.append(data)
            
            decade_list.sort(key=lambda x: x['decade'])
            
            # Évolution des pays (top 10 pays les plus performants)
            top_countries = {}
            for noc, years in country_yearly.items():
                total_medals = sum(year_data['total'] for year_data in years.values())
                if total_medals > 0:
                    top_countries[noc] = total_medals
            
            # Trier et prendre les top 10
            top_10_countries = sorted(top_countries.items(), key=lambda x: x[1], reverse=True)[:10]
            
            country_evolution = []
            for noc, _ in top_10_countries:
                evolution = []
                for year in sorted(yearly_data.keys()):
                    if year in country_yearly[noc]:
                        evolution.append({
                            'year': year,
                            'medals': country_yearly[noc][year]['total'],
                            'gold': country_yearly[noc][year]['gold'],
                            'silver': country_yearly[noc][year]['silver'],
                            'bronze': country_yearly[noc][year]['bronze']
                        })
                    else:
                        evolution.append({
                            'year': year,
                            'medals': 0,
                            'gold': 0,
                            'silver': 0,
                            'bronze': 0
                        })
                
                country_evolution.append({
                    'country': noc,
                    'total_medals': top_countries[noc],
                    'evolution': evolution
                })
            
            # Évolution des sports (top 10 sports)
            top_sports = {}
            for sport, years in sport_yearly.items():
                total_medals = sum(year_data['total'] for year_data in years.values())
                if total_medals > 0:
                    top_sports[sport] = total_medals
            
            top_10_sports = sorted(top_sports.items(), key=lambda x: x[1], reverse=True)[:10]
            
            sport_evolution = []
            for sport, _ in top_10_sports:
                evolution = []
                for year in sorted(yearly_data.keys()):
                    if year in sport_yearly[sport]:
                        evolution.append({
                            'year': year,
                            'medals': sport_yearly[sport][year]['total'],
                            'gold': sport_yearly[sport][year]['gold'],
                            'silver': sport_yearly[sport][year]['silver'],
                            'bronze': sport_yearly[sport][year]['bronze']
                        })
                    else:
                        evolution.append({
                            'year': year,
                            'medals': 0,
                            'gold': 0,
                            'silver': 0,
                            'bronze': 0
                        })
                
                sport_evolution.append({
                    'sport': sport,
                    'total_medals': top_sports[sport],
                    'evolution': evolution
                })
            
            # Tendances de participation
            participation_trends = []
            for year_data in yearly_medals:
                participation_trends.append({
                    'year': year_data['year'],
                    'countries': year_data['countries_count'],
                    'sports': year_data['sports_count'],
                    'medals': year_data['total']
                })
            
            # Statistiques globales
            total_years = len(yearly_medals)
            total_medals_all_time = sum(year['total'] for year in yearly_medals)
            total_gold_all_time = sum(year['gold'] for year in yearly_medals)
            total_silver_all_time = sum(year['silver'] for year in yearly_medals)
            total_bronze_all_time = sum(year['bronze'] for year in yearly_medals)
            
            # Trouver les années les plus performantes
            best_year = max(yearly_medals, key=lambda x: x['total']) if yearly_medals else None
            worst_year = min(yearly_medals, key=lambda x: x['total']) if yearly_medals else None
            
            # Calculer les tendances
            if len(yearly_medals) >= 2:
                first_year = yearly_medals[0]['total']
                last_year = yearly_medals[-1]['total']
                growth_rate = ((last_year - first_year) / first_year) * 100 if first_year > 0 else 0
            else:
                growth_rate = 0
            
            return {
                'status': 'success',
                'data': {
                    'yearly_medals': yearly_medals,
                    'decade_analysis': decade_list,
                    'country_evolution': country_evolution,
                    'sport_evolution': sport_evolution,
                    'participation_trends': participation_trends,
                    'analysis': {
                        'total_years': total_years,
                        'total_medals_all_time': total_medals_all_time,
                        'total_gold_all_time': total_gold_all_time,
                        'total_silver_all_time': total_silver_all_time,
                        'total_bronze_all_time': total_bronze_all_time,
                        'best_year': best_year,
                        'worst_year': worst_year,
                        'growth_rate': round(growth_rate, 2),
                        'average_medals_per_year': total_medals_all_time / total_years if total_years > 0 else 0,
                        'most_consistent_country': max(country_evolution, key=lambda x: x['total_medals'])['country'] if country_evolution else None,
                        'most_consistent_sport': max(sport_evolution, key=lambda x: x['total_medals'])['sport'] if sport_evolution else None
                    }
                }
            }
        except Exception as error:
            return {
                'status': 'error',
                'message': str(error)
            }
    
    @staticmethod
    def get_success_factors_analysis():
        """Analyser les facteurs de succès olympiques"""
        try:
            supabase = get_supabase_client()
            
            # Récupérer toutes les médailles avec les détails
            result = supabase.table('m_award').select('year, noc, medal, award_count, sport').execute()
            
            if not result.data:
                return {
                    'status': 'success',
                    'data': {
                        'sport_specialization': [],
                        'host_advantage': [],
                        'economic_factors': [],
                        'historical_performance': [],
                        'sport_diversity': [],
                        'success_patterns': [],
                        'analysis': {}
                    }
                }
            
            # Analyser la spécialisation sportive par pays
            country_sports = {}
            country_medals = {}
            host_countries = set()
            yearly_data = {}
            
            for medal in result.data:
                year = medal['year']
                noc = medal['noc']
                medal_type = medal['medal']
                count = medal['award_count']
                sport = medal['sport']
                
                # Données par pays
                if noc not in country_medals:
                    country_medals[noc] = {
                        'country': noc,
                        'gold': 0,
                        'silver': 0,
                        'bronze': 0,
                        'total': 0,
                        'sports': set(),
                        'years': set(),
                        'sport_specialization': 0,
                        'diversity_score': 0
                    }
                
                if medal_type == 'GOLD':
                    country_medals[noc]['gold'] += count
                elif medal_type == 'SILVER':
                    country_medals[noc]['silver'] += count
                elif medal_type == 'BRONZE':
                    country_medals[noc]['bronze'] += count
                
                country_medals[noc]['total'] += count
                country_medals[noc]['sports'].add(sport)
                country_medals[noc]['years'].add(year)
                
                # Données par sport et pays
                if noc not in country_sports:
                    country_sports[noc] = {}
                if sport not in country_sports[noc]:
                    country_sports[noc][sport] = {
                        'sport': sport,
                        'gold': 0,
                        'silver': 0,
                        'bronze': 0,
                        'total': 0
                    }
                
                if medal_type == 'GOLD':
                    country_sports[noc][sport]['gold'] += count
                elif medal_type == 'SILVER':
                    country_sports[noc][sport]['silver'] += count
                elif medal_type == 'BRONZE':
                    country_sports[noc][sport]['bronze'] += count
                
                country_sports[noc][sport]['total'] += count
                
                # Données par année
                if year not in yearly_data:
                    yearly_data[year] = {
                        'year': year,
                        'countries': set(),
                        'sports': set(),
                        'total_medals': 0
                    }
                
                yearly_data[year]['countries'].add(noc)
                yearly_data[year]['sports'].add(sport)
                yearly_data[year]['total_medals'] += count
            
            # Calculer la spécialisation sportive
            sport_specialization = []
            for noc, sports in country_sports.items():
                if country_medals[noc]['total'] > 0:
                    # Trouver le sport dominant
                    dominant_sport = max(sports.items(), key=lambda x: x[1]['total'])
                    sport_ratio = dominant_sport[1]['total'] / country_medals[noc]['total']
                    
                    # Calculer la diversité sportive
                    diversity_score = len(sports) / len(set(sport for sport_data in sports.values() for sport in [sport_data['sport']]))
                    
                    sport_specialization.append({
                        'country': noc,
                        'dominant_sport': dominant_sport[0],
                        'dominant_sport_medals': dominant_sport[1]['total'],
                        'sport_ratio': round(sport_ratio, 3),
                        'diversity_score': round(diversity_score, 3),
                        'total_medals': country_medals[noc]['total'],
                        'sports_count': len(sports)
                    })
            
            # Trier par ratio de spécialisation
            sport_specialization.sort(key=lambda x: x['sport_ratio'], reverse=True)
            
            # Analyser l'avantage du pays hôte (simulation basée sur les données disponibles)
            host_advantage = []
            for year, data in yearly_data.items():
                # Simuler l'identification des pays hôtes (dans un vrai système, on aurait une table des hôtes)
                # Pour cette analyse, on considère que les pays avec le plus de médailles sont potentiellement les hôtes
                top_countries = sorted([(noc, country_medals[noc]['total']) for noc in data['countries']], 
                                     key=lambda x: x[1], reverse=True)[:3]
                
                for noc, medals in top_countries:
                    if medals > 0:
                        host_advantage.append({
                            'year': year,
                            'country': noc,
                            'medals': medals,
                            'is_potential_host': True
                        })
            
            # Analyser les facteurs économiques (simulation)
            economic_factors = []
            for noc, data in country_medals.items():
                if data['total'] > 0:
                    # Simuler des facteurs économiques basés sur les performances
                    economic_score = data['total'] * 0.1  # Score économique simulé
                    gdp_impact = data['gold'] * 0.3 + data['silver'] * 0.2 + data['bronze'] * 0.1
                    
                    economic_factors.append({
                        'country': noc,
                        'economic_score': round(economic_score, 2),
                        'gdp_impact': round(gdp_impact, 2),
                        'total_medals': data['total'],
                        'investment_ratio': round(economic_score / data['total'], 3) if data['total'] > 0 else 0
                    })
            
            # Analyser les performances historiques
            historical_performance = []
            for noc, data in country_medals.items():
                if data['total'] > 0:
                    years_active = len(data['years'])
                    average_per_year = data['total'] / years_active if years_active > 0 else 0
                    consistency_score = years_active / len(yearly_data) if yearly_data else 0
                    
                    historical_performance.append({
                        'country': noc,
                        'years_active': years_active,
                        'average_per_year': round(average_per_year, 2),
                        'consistency_score': round(consistency_score, 3),
                        'total_medals': data['total'],
                        'gold_ratio': round(data['gold'] / data['total'], 3) if data['total'] > 0 else 0
                    })
            
            # Analyser la diversité sportive
            sport_diversity = []
            for noc, data in country_medals.items():
                if data['total'] > 0:
                    sports_count = len(data['sports'])
                    diversity_index = sports_count / 50  # Normaliser sur 50 sports max
                    
                    sport_diversity.append({
                        'country': noc,
                        'sports_count': sports_count,
                        'diversity_index': round(diversity_index, 3),
                        'total_medals': data['total'],
                        'medals_per_sport': round(data['total'] / sports_count, 2) if sports_count > 0 else 0
                    })
            
            # Identifier les patterns de succès
            success_patterns = []
            
            # Pattern 1: Spécialisation vs Diversification
            specialized_countries = [c for c in sport_specialization if c['sport_ratio'] > 0.5]
            diversified_countries = [c for c in sport_specialization if c['sport_ratio'] < 0.3]
            
            success_patterns.append({
                'pattern': 'Spécialisation Sportive',
                'description': 'Pays se concentrant sur un sport dominant',
                'countries': specialized_countries[:10],
                'success_rate': len([c for c in specialized_countries if c['total_medals'] > 50]) / len(specialized_countries) if specialized_countries else 0
            })
            
            success_patterns.append({
                'pattern': 'Diversification Sportive',
                'description': 'Pays participant à de nombreux sports',
                'countries': diversified_countries[:10],
                'success_rate': len([c for c in diversified_countries if c['total_medals'] > 50]) / len(diversified_countries) if diversified_countries else 0
            })
            
            # Pattern 2: Consistance historique
            consistent_countries = [c for c in historical_performance if c['consistency_score'] > 0.7]
            success_patterns.append({
                'pattern': 'Consistance Historique',
                'description': 'Pays performants sur de longues périodes',
                'countries': consistent_countries[:10],
                'success_rate': len([c for c in consistent_countries if c['total_medals'] > 100]) / len(consistent_countries) if consistent_countries else 0
            })
            
            # Statistiques globales
            total_countries = len(country_medals)
            total_medals = sum(data['total'] for data in country_medals.values())
            avg_medals_per_country = total_medals / total_countries if total_countries > 0 else 0
            
            # Top performers
            top_performers = sorted(country_medals.items(), key=lambda x: x[1]['total'], reverse=True)[:10]
            
            return {
                'status': 'success',
                'data': {
                    'sport_specialization': sport_specialization[:20],
                    'host_advantage': host_advantage[:30],
                    'economic_factors': sorted(economic_factors, key=lambda x: x['economic_score'], reverse=True)[:20],
                    'historical_performance': sorted(historical_performance, key=lambda x: x['total_medals'], reverse=True)[:20],
                    'sport_diversity': sorted(sport_diversity, key=lambda x: x['diversity_index'], reverse=True)[:20],
                    'success_patterns': success_patterns,
                    'analysis': {
                        'total_countries': total_countries,
                        'total_medals': total_medals,
                        'avg_medals_per_country': round(avg_medals_per_country, 2),
                        'top_performers': [{'country': noc, 'medals': data['total']} for noc, data in top_performers],
                        'most_specialized': sport_specialization[0] if sport_specialization else None,
                        'most_diverse': max(sport_diversity, key=lambda x: x['diversity_index']) if sport_diversity else None,
                        'most_consistent': max(historical_performance, key=lambda x: x['consistency_score']) if historical_performance else None
                    }
                }
            }
        except Exception as error:
            return {
                'status': 'error',
                'message': str(error)
            }