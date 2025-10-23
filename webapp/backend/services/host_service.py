"""
Service pour gérer les opérations liées aux villes hôtes
"""
from database.supabase_client import get_supabase_client
from collections import Counter

class HostService:
    @staticmethod
    def get_hosts(page=1, limit=20, search='', sort_by='', sort_order='asc', filters=None):
        """Récupérer les données des villes hôtes avec filtres et pagination"""
        try:
            supabase = get_supabase_client()
            
            # Construire la requête de base
            query = supabase.table('hosts').select('*', count='exact')
            
            # Appliquer les filtres
            if filters:
                if 'country' in filters:
                    query = query.eq('country', filters['country'])
                if 'year' in filters:
                    query = query.eq('year', filters['year'])
                if 'season' in filters:
                    query = query.eq('season', filters['season'])
                if 'year_min' in filters:
                    query = query.gte('year', filters['year_min'])
                if 'year_max' in filters:
                    query = query.lte('year', filters['year_max'])
            
            # Appliquer la recherche
            if search:
                query = query.or_(f'city.ilike.%{search}%,country.ilike.%{search}%')
            
            # Appliquer le tri
            if sort_by:
                order = f'{sort_by}.{sort_order}'
                query = query.order(order)
            else:
                query = query.order('year.desc')
            
            # Appliquer la pagination
            offset = (page - 1) * limit
            query = query.range(offset, offset + limit - 1)
            
            result = query.execute()
            
            return {
                'status': 'success',
                'data': result.data,
                'total': result.count,
                'page': page,
                'limit': limit,
                'total_pages': (result.count + limit - 1) // limit if result.count else 0
            }
        except Exception as error:
            return {
                'status': 'error',
                'message': str(error)
            }
    
    @staticmethod
    def get_hosts_ranking():
        """Récupérer le classement des pays organisateurs de JO"""
        try:
            supabase = get_supabase_client()
            result = supabase.table('hosts').select('*').execute()
            
            if not result.data:
                return {
                    'status': 'error',
                    'message': 'Aucune donnée trouvée'
                }
            
            # Compter les JO par pays
            country_counts = Counter()
            country_details = {}
            
            for host in result.data:
                country = host.get('country', 'Unknown')
                year = host.get('year')
                season = host.get('season', 'Unknown')
                city = host.get('city', 'Unknown')
                
                country_counts[country] += 1
                
                if country not in country_details:
                    country_details[country] = []
                
                country_details[country].append({
                    'year': year,
                    'season': season,
                    'city': city
                })
            
            # Créer le classement
            ranking = []
            for country, count in country_counts.most_common():
                ranking.append({
                    'country': country,
                    'total_games': count,
                    'games': country_details[country]
                })
            
            # Analyser la position de la France
            france_position = None
            france_data = None
            for i, country_data in enumerate(ranking):
                if country_data['country'].lower() in ['france', 'french']:
                    france_position = i + 1
                    france_data = country_data
                    break
            
            return {
                'status': 'success',
                'ranking': ranking,
                'france_position': france_position,
                'france_data': france_data,
                'total_countries': len(ranking)
            }
            
        except Exception as error:
            return {
                'status': 'error',
                'message': str(error)
            }
