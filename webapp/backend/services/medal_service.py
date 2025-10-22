"""
Service pour gérer les opérations liées aux médailles
"""
from database.supabase_client import get_supabase_client

class MedalService:
    @staticmethod
    def get_medals(limit: int = 10):
        """Récupérer les données de médailles"""
        try:
            supabase = get_supabase_client()
            result = supabase.table('medals').select('*').limit(limit).execute()
            
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
    def get_rewards(limit: int = 10):
        """Récupérer les données de récompenses (table medals)"""
        try:
            supabase = get_supabase_client()
            result = supabase.table('m_award').select('*').limit(limit).execute()
            
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
