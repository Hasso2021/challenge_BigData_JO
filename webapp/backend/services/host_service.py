"""
Service pour gérer les opérations liées aux villes hôtes
"""
from database.supabase_client import get_supabase_client

class HostService:
    @staticmethod
    def get_hosts(limit: int = 50):
        """Récupérer les données des villes hôtes des Jeux Olympiques"""
        try:
            supabase = get_supabase_client()
            result = supabase.table('hosts').select('*').limit(limit).execute()
            
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
