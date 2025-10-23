#!/usr/bin/env python3
"""
Detailed analysis of Olympic database tables
"""
import os
import sys
from pathlib import Path

# Add backend directory to path
backend_dir = Path(__file__).parent
sys.path.insert(0, str(backend_dir))

try:
    from database.supabase_client import get_supabase_client
    
    def analyze_athletes():
        """Analyze athletes table"""
        print("=" * 80)
        print("ATHLETES TABLE ANALYSIS")
        print("=" * 80)
        try:
            supabase = get_supabase_client()
            
            # Get total count
            count_result = supabase.table('athlete').select('*', count='exact').execute()
            total_count = count_result.count
            print(f"Total Athletes: {total_count}")
            
            # Get sample data
            result = supabase.table('athlete').select('*').limit(10).execute()
            
            print(f"\nSample Data (showing {len(result.data)} records):")
            print("-" * 80)
            
            for i, athlete in enumerate(result.data, 1):
                print(f"\n{i:2d}. {athlete.get('athlete_full_name', 'N/A')}")
                print(f"    ID: {athlete.get('athlete_id', 'N/A')}")
                print(f"    Birth Year: {athlete.get('athlete_year_birth', 'N/A')}")
                print(f"    First Game: {athlete.get('first_game', 'N/A')} ({athlete.get('first_year', 'N/A')})")
                print(f"    Participations: {athlete.get('games_participations', 'N/A')}")
                print(f"    Medals - Gold: {athlete.get('medal_gold', 'N/A')}, Silver: {athlete.get('medal_silver', 'N/A')}, Bronze: {athlete.get('medal_bronze', 'N/A')}")
                print(f"    Total Medals: {athlete.get('medal_total', 'N/A')}")
                print(f"    URL: {athlete.get('athlete_url', 'N/A')}")
            
            return result.data
        except Exception as e:
            print(f"Error analyzing athletes: {e}")
            return []
    
    def analyze_medals():
        """Analyze medals table"""
        print("\n" + "=" * 80)
        print("MEDALS TABLE ANALYSIS")
        print("=" * 80)
        try:
            supabase = get_supabase_client()
            
            # Get total count
            count_result = supabase.table('medals').select('*', count='exact').execute()
            total_count = count_result.count
            print(f"Total Medals: {total_count}")
            
            # Get sample data
            result = supabase.table('medals').select('*').limit(10).execute()
            
            print(f"\nSample Data (showing {len(result.data)} records):")
            print("-" * 80)
            
            for i, medal in enumerate(result.data, 1):
                print(f"\n{i:2d}. {medal.get('athlete', 'N/A')}")
                print(f"    Country: {medal.get('country', 'N/A')} ({medal.get('noc', 'N/A')})")
                print(f"    Sport: {medal.get('sport', 'N/A')}")
                print(f"    Event: {medal.get('event', 'N/A')}")
                print(f"    Medal Type: {medal.get('medal', 'N/A')}")
                print(f"    Year: {medal.get('year', 'N/A')}")
                print(f"    Gender: {medal.get('event_gender', 'N/A')}")
                print(f"    Participant Type: {medal.get('participant_type', 'N/A')}")
                print(f"    Is Team: {medal.get('is_team', 'N/A')}")
            
            return result.data
        except Exception as e:
            print(f"Error analyzing medals: {e}")
            return []
    
    def analyze_results():
        """Analyze olympic results table"""
        print("\n" + "=" * 80)
        print("OLYMPIC RESULTS TABLE ANALYSIS")
        print("=" * 80)
        try:
            supabase = get_supabase_client()
            
            # Get total count
            count_result = supabase.table('olympic_results').select('*', count='exact').execute()
            total_count = count_result.count
            print(f"Total Results: {total_count}")
            
            # Get sample data
            result = supabase.table('olympic_results').select('*').limit(10).execute()
            
            print(f"\nSample Data (showing {len(result.data)} records):")
            print("-" * 80)
            
            for i, result_item in enumerate(result.data, 1):
                print(f"\n{i:2d}. {result_item.get('athlete_full_name', 'N/A')}")
                print(f"    Country: {result_item.get('country_name', 'N/A')} ({result_item.get('country_3_letter_code', 'N/A')})")
                print(f"    Discipline: {result_item.get('discipline_title', 'N/A')}")
                print(f"    Event: {result_item.get('event_title', 'N/A')}")
                print(f"    Position: {result_item.get('rank_position', 'N/A')}")
                print(f"    Year: {result_item.get('year', 'N/A')} ({result_item.get('season', 'N/A')})")
                print(f"    Medal Type: {result_item.get('medal_type', 'N/A')}")
                print(f"    Gold: {result_item.get('gold', 'N/A')}, Silver: {result_item.get('silver', 'N/A')}, Bronze: {result_item.get('bronze', 'N/A')}")
                print(f"    Value: {result_item.get('value_unit', 'N/A')} ({result_item.get('value_type', 'N/A')})")
            
            return result.data
        except Exception as e:
            print(f"Error analyzing results: {e}")
            return []
    
    def analyze_hosts():
        """Analyze hosts table"""
        print("\n" + "=" * 80)
        print("HOST CITIES TABLE ANALYSIS")
        print("=" * 80)
        try:
            supabase = get_supabase_client()
            
            # Get total count
            count_result = supabase.table('hosts').select('*', count='exact').execute()
            total_count = count_result.count
            print(f"Total Host Cities: {total_count}")
            
            # Get sample data
            result = supabase.table('hosts').select('*').limit(10).execute()
            
            print(f"\nSample Data (showing {len(result.data)} records):")
            print("-" * 80)
            
            for i, host in enumerate(result.data, 1):
                print(f"\n{i:2d}. {host.get('city', 'N/A')}, {host.get('country', 'N/A')}")
                print(f"    Year: {host.get('year', 'N/A')}")
                print(f"    Season: {host.get('season', 'N/A')}")
                print(f"    Name: {host.get('name', 'N/A')}")
                print(f"    Slug: {host.get('slug', 'N/A')}")
                print(f"    Start Date: {host.get('start_date', 'N/A')}")
                print(f"    End Date: {host.get('end_date', 'N/A')}")
                print(f"    Duration: {host.get('duration_days', 'N/A')} days")
                print(f"    Created: {host.get('created_at', 'N/A')}")
            
            return result.data
        except Exception as e:
            print(f"Error analyzing hosts: {e}")
            return []
    
    def main():
        print("OLYMPIC DATABASE DETAILED ANALYSIS")
        print("Analyzing all Olympic database tables...")
        
        athletes = analyze_athletes()
        medals = analyze_medals()
        results = analyze_results()
        hosts = analyze_hosts()
        
        print("\n" + "=" * 80)
        print("ANALYSIS SUMMARY")
        print("=" * 80)
        print(f"Athletes: {len(athletes)} sample records analyzed")
        print(f"Medals: {len(medals)} sample records analyzed")
        print(f"Results: {len(results)} sample records analyzed")
        print(f"Hosts: {len(hosts)} sample records analyzed")
        print("\nAnalysis completed successfully!")
        
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
