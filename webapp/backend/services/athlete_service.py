"""
Service pour gérer les opérations liées aux athlètes
"""
from database.supabase_client import get_supabase_client

class AthleteService:
    @staticmethod
    def get_athletes(page=1, limit=20, search='', sort_by='', sort_order='asc', filters=None):
        """Récupérer la liste des athlètes avec filtres et pagination"""
        try:
            supabase = get_supabase_client()
            
            if supabase is None:
                return {
                    'status': 'error',
                    'message': 'Client Supabase non initialisé'
                }
            
            # Construire la requête de base
            query = supabase.table('athlete').select('*', count='exact')
            
            # Appliquer les filtres
            if filters:
                if 'year' in filters:
                    query = query.eq('first_year', filters['year'])
                if 'year_min' in filters:
                    query = query.gte('first_year', filters['year_min'])
                if 'year_max' in filters:
                    query = query.lte('first_year', filters['year_max'])
            
            # Appliquer la recherche
            if search:
                query = query.or_(f'athlete_full_name.ilike.%{search}%')
            
            # Appliquer le tri
            if sort_by:
                order = f'{sort_by}.{sort_order}'
                query = query.order(order)
            else:
                query = query.order('athlete_full_name.asc')
            
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
