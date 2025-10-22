"""
Service pour gérer les opérations liées aux résultats olympiques
"""
from database.supabase_client import get_supabase_client

class OlympicResultsService:
    @staticmethod
    def get_olympic_results(limit: int = 10):
        """Récupérer les résultats olympiques"""
        try:
            supabase = get_supabase_client()
            result = supabase.table('olympic_results').select('*').limit(limit).execute()
            
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
