"""
Service pour gérer les opérations liées aux athlètes
"""
from database.supabase_client import get_supabase_client

class AthleteService:
    @staticmethod
    def get_athletes(limit: int = 10):
        """Récupérer la liste des athlètes"""
        try:
            supabase = get_supabase_client()
            result = supabase.table('athlete').select('*').limit(limit).execute()
            
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
