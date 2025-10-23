#!/usr/bin/env python3
"""
Script to fetch data directly from database tables
"""
import os
import sys
import json
from pathlib import Path

# Add backend directory to path
backend_dir = Path(__file__).parent
sys.path.insert(0, str(backend_dir))

try:
    from database.supabase_client import get_supabase_client
    
    def fetch_athletes_data(limit=10):
        """Fetch athletes data"""
        try:
            supabase = get_supabase_client()
            result = supabase.table('athlete').select('*').limit(limit).execute()
            
            print("=" * 60)
            print("ATHLETES DATA")
            print("=" * 60)
            print(f"Total records: {len(result.data)}")
            print("\nSample data:")
            for i, athlete in enumerate(result.data[:5], 1):
                print(f"\n{i}. {athlete.get('athlete_full_name', 'N/A')}")
                print(f"   Birth Year: {athlete.get('athlete_year_birth', 'N/A')}")
                print(f"   First Game: {athlete.get('first_game', 'N/A')}")
                print(f"   Participations: {athlete.get('games_participations', 'N/A')}")
                print(f"   Total Medals: {athlete.get('medal_total', 'N/A')}")
            
            return result.data
        except Exception as e:
            print(f"Error fetching athletes: {e}")
            return []
    
    def fetch_medals_data(limit=10):
        """Fetch medals data"""
        try:
            supabase = get_supabase_client()
            result = supabase.table('medals').select('*').limit(limit).execute()
            
            print("\n" + "=" * 60)
            print("MEDALS DATA")
            print("=" * 60)
            print(f"Total records: {len(result.data)}")
            print("\nSample data:")
            for i, medal in enumerate(result.data[:5], 1):
                print(f"\n{i}. {medal.get('athlete', 'N/A')}")
                print(f"   Country: {medal.get('country', 'N/A')}")
                print(f"   Sport: {medal.get('sport', 'N/A')}")
                print(f"   Event: {medal.get('event', 'N/A')}")
                print(f"   Medal: {medal.get('medal', 'N/A')}")
                print(f"   Year: {medal.get('year', 'N/A')}")
            
            return result.data
        except Exception as e:
            print(f"Error fetching medals: {e}")
            return []
    
    def fetch_results_data(limit=10):
        """Fetch olympic results data"""
        try:
            supabase = get_supabase_client()
            result = supabase.table('olympic_results').select('*').limit(limit).execute()
            
            print("\n" + "=" * 60)
            print("OLYMPIC RESULTS DATA")
            print("=" * 60)
            print(f"Total records: {len(result.data)}")
            print("\nSample data:")
            for i, result_item in enumerate(result.data[:5], 1):
                print(f"\n{i}. {result_item.get('athlete_full_name', 'N/A')}")
                print(f"   Country: {result_item.get('country_name', 'N/A')}")
                print(f"   Discipline: {result_item.get('discipline_title', 'N/A')}")
                print(f"   Event: {result_item.get('event_title', 'N/A')}")
                print(f"   Position: {result_item.get('rank_position', 'N/A')}")
                print(f"   Year: {result_item.get('year', 'N/A')}")
            
            return result.data
        except Exception as e:
            print(f"Error fetching results: {e}")
            return []
    
    def fetch_hosts_data(limit=10):
        """Fetch hosts data"""
        try:
            supabase = get_supabase_client()
            result = supabase.table('hosts').select('*').limit(limit).execute()
            
            print("\n" + "=" * 60)
            print("HOSTS DATA")
            print("=" * 60)
            print(f"Total records: {len(result.data)}")
            print("\nSample data:")
            for i, host in enumerate(result.data[:5], 1):
                print(f"\n{i}. {host.get('city', 'N/A')}, {host.get('country', 'N/A')}")
                print(f"   Year: {host.get('year', 'N/A')}")
                print(f"   Season: {host.get('season', 'N/A')}")
                print(f"   Duration: {host.get('duration_days', 'N/A')} days")
                print(f"   Dates: {host.get('start_date', 'N/A')} to {host.get('end_date', 'N/A')}")
            
            return result.data
        except Exception as e:
            print(f"Error fetching hosts: {e}")
            return []
    
    def main():
        print("FETCHING DATA FROM DATABASE")
        print("=" * 60)
        
        # Fetch all data
        athletes = fetch_athletes_data(20)
        medals = fetch_medals_data(20)
        results = fetch_results_data(20)
        hosts = fetch_hosts_data(20)
        
        # Summary
        print("\n" + "=" * 60)
        print("SUMMARY")
        print("=" * 60)
        print(f"Athletes: {len(athletes)} records")
        print(f"Medals: {len(medals)} records")
        print(f"Results: {len(results)} records")
        print(f"Hosts: {len(hosts)} records")
        
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
