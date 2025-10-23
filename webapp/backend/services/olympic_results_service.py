"""
Service pour gérer les opérations liées aux résultats olympiques
"""
from database.supabase_client import get_supabase_client

class OlympicResultsService:
    @staticmethod
    def get_olympic_results(page=1, limit=None, search='', sort_by='', sort_order='asc', filters=None):
        """Récupérer les résultats olympiques avec filtres et pagination"""
        try:
            supabase = get_supabase_client()
            
            # Construire la requête de base
            query = supabase.table('medals').select('*', count='exact')
            
            # Appliquer les filtres
            if filters:
                if 'country' in filters:
                    query = query.eq('noc', filters['country'])
                if 'sport' in filters:
                    query = query.eq('sport', filters['sport'])
                if 'year' in filters:
                    query = query.eq('year', filters['year'])
                if 'year_min' in filters:
                    query = query.gte('year', filters['year_min'])
                if 'year_max' in filters:
                    query = query.lte('year', filters['year_max'])
            
            # Appliquer la recherche
            if search:
                query = query.or_(f'athlete.ilike.%{search}%,country.ilike.%{search}%,sport.ilike.%{search}%')
            
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
