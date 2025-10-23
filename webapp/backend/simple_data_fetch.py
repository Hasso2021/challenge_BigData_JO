#!/usr/bin/env python3
"""
Simple script to fetch and display data from Olympic tables
"""
import os
import sys
from pathlib import Path

# Add backend directory to path
backend_dir = Path(__file__).parent
sys.path.insert(0, str(backend_dir))

try:
    from database.supabase_client import get_supabase_client
    
    def fetch_athletes():
        """Fetch athletes data"""
        print("=" * 60)
        print("ATHLETES DATA")
        print("=" * 60)
        try:
            supabase = get_supabase_client()
            result = supabase.table('athlete').select('*').limit(20).execute()
            print(f"Total records: {len(result.data)}")
            print("\nSample athletes:")
            for i, athlete in enumerate(result.data[:5], 1):
                print(f"{i}. {athlete.get('athlete_full_name', 'N/A')}")
                print(f"   Birth: {athlete.get('athlete_year_birth', 'N/A')}")
                print(f"   First Game: {athlete.get('first_game', 'N/A')}")
                print(f"   Medals: {athlete.get('medal_total', 'N/A')}")
                print()
            return result.data
        except Exception as e:
            print(f"Error: {e}")
            return []
    
    def fetch_medals():
        """Fetch medals data"""
        print("\n" + "=" * 60)
        print("MEDALS DATA")
        print("=" * 60)
        try:
            supabase = get_supabase_client()
            result = supabase.table('medals').select('*').limit(20).execute()
            print(f"Total records: {len(result.data)}")
            print("\nSample medals:")
            for i, medal in enumerate(result.data[:5], 1):
                print(f"{i}. {medal.get('athlete', 'N/A')}")
                print(f"   Country: {medal.get('country', 'N/A')}")
                print(f"   Sport: {medal.get('sport', 'N/A')}")
                print(f"   Medal: {medal.get('medal', 'N/A')}")
                print(f"   Year: {medal.get('year', 'N/A')}")
                print()
            return result.data
        except Exception as e:
            print(f"Error: {e}")
            return []
    
    def fetch_results():
        """Fetch results data"""
        print("\n" + "=" * 60)
        print("OLYMPIC RESULTS DATA")
        print("=" * 60)
        try:
            supabase = get_supabase_client()
            result = supabase.table('olympic_results').select('*').limit(20).execute()
            print(f"Total records: {len(result.data)}")
            print("\nSample results:")
            for i, result_item in enumerate(result.data[:5], 1):
                print(f"{i}. {result_item.get('athlete_full_name', 'N/A')}")
                print(f"   Country: {result_item.get('country_name', 'N/A')}")
                print(f"   Discipline: {result_item.get('discipline_title', 'N/A')}")
                print(f"   Position: {result_item.get('rank_position', 'N/A')}")
                print(f"   Year: {result_item.get('year', 'N/A')}")
                print()
            return result.data
        except Exception as e:
            print(f"Error: {e}")
            return []
    
    def fetch_hosts():
        """Fetch hosts data"""
        print("\n" + "=" * 60)
        print("HOST CITIES DATA")
        print("=" * 60)
        try:
            supabase = get_supabase_client()
            result = supabase.table('hosts').select('*').limit(20).execute()
            print(f"Total records: {len(result.data)}")
            print("\nSample host cities:")
            for i, host in enumerate(result.data[:5], 1):
                print(f"{i}. {host.get('city', 'N/A')}, {host.get('country', 'N/A')}")
                print(f"   Year: {host.get('year', 'N/A')}")
                print(f"   Season: {host.get('season', 'N/A')}")
                print(f"   Duration: {host.get('duration_days', 'N/A')} days")
                print()
            return result.data
        except Exception as e:
            print(f"Error: {e}")
            return []
    
    def main():
        print("OLYMPIC DATABASE DATA FETCHER")
        print("Fetching data from all tables...")
        
        athletes = fetch_athletes()
        medals = fetch_medals()
        results = fetch_results()
        hosts = fetch_hosts()
        
        print("\n" + "=" * 60)
        print("SUMMARY")
        print("=" * 60)
        print(f"Athletes: {len(athletes)} records")
        print(f"Medals: {len(medals)} records")
        print(f"Results: {len(results)} records")
        print(f"Hosts: {len(hosts)} records")
        print("\nData fetching completed successfully!")
        
        return {
            'athletes': athletes,
            'medals': medals,
            'results': results,
            'hosts': hosts
        }
    
    if __name__ == "__main__":
        data = main()
        
except ImportError as e:
    print(f"Import error: {e}")
    print("Make sure you're in the backend directory and dependencies are installed")
except Exception as e:
    print(f"Error: {e}")
