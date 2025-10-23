#!/usr/bin/env python3
"""
Script to display data from all Olympic tables in a formatted way
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
    
    def display_athletes_data():
        """Display athletes data"""
        try:
            supabase = get_supabase_client()
            result = supabase.table('athlete').select('*').limit(50).execute()
            
            print("ATHLETES DATA")
            print("=" * 80)
            print(f"Total records fetched: {len(result.data)}")
            print("\nSample Athletes:")
            print("-" * 80)
            
            for i, athlete in enumerate(result.data[:10], 1):
                print(f"{i:2d}. {athlete.get('athlete_full_name', 'N/A')}")
                print(f"    Birth Year: {athlete.get('athlete_year_birth', 'N/A')}")
                print(f"    First Game: {athlete.get('first_game', 'N/A')} ({athlete.get('first_year', 'N/A')})")
                print(f"    Participations: {athlete.get('games_participations', 'N/A')}")
                print(f"    Gold: {athlete.get('medal_gold', 'N/A')} | Silver: {athlete.get('medal_silver', 'N/A')} | Bronze: {athlete.get('medal_bronze', 'N/A')}")
                print(f"    Total Medals: {athlete.get('medal_total', 'N/A')}")
                print()
            
            return result.data
        except Exception as e:
            print(f"Error fetching athletes: {e}")
            return []
    
    def display_medals_data():
        """Display medals data"""
        try:
            supabase = get_supabase_client()
            result = supabase.table('medals').select('*').limit(50).execute()
            
            print("\n🏅 MEDALS DATA")
            print("=" * 80)
            print(f"📊 Total records fetched: {len(result.data)}")
            print("\n📋 Sample Medals:")
            print("-" * 80)
            
            for i, medal in enumerate(result.data[:10], 1):
                medal_emoji = "🥇" if medal.get('medal') == 'GOLD' else "🥈" if medal.get('medal') == 'SILVER' else "🥉"
                print(f"{i:2d}. {medal_emoji} {medal.get('athlete', 'N/A')}")
                print(f"    🏴 Country: {medal.get('country', 'N/A')} ({medal.get('noc', 'N/A')})")
                print(f"    🏃 Sport: {medal.get('sport', 'N/A')}")
                print(f"    🎯 Event: {medal.get('event', 'N/A')}")
                print(f"    🏆 Medal: {medal.get('medal', 'N/A')}")
                print(f"    📅 Year: {medal.get('year', 'N/A')}")
                print()
            
            return result.data
        except Exception as e:
            print(f"❌ Error fetching medals: {e}")
            return []
    
    def display_results_data():
        """Display olympic results data"""
        try:
            supabase = get_supabase_client()
            result = supabase.table('olympic_results').select('*').limit(50).execute()
            
            print("\n📊 OLYMPIC RESULTS DATA")
            print("=" * 80)
            print(f"📊 Total records fetched: {len(result.data)}")
            print("\n📋 Sample Results:")
            print("-" * 80)
            
            for i, result_item in enumerate(result.data[:10], 1):
                position = result_item.get('rank_position', 'N/A')
                position_emoji = "🥇" if position == "1" else "🥈" if position == "2" else "🥉" if position == "3" else "🏃"
                print(f"{i:2d}. {position_emoji} {result_item.get('athlete_full_name', 'N/A')}")
                print(f"    🏴 Country: {result_item.get('country_name', 'N/A')}")
                print(f"    🏃 Discipline: {result_item.get('discipline_title', 'N/A')}")
                print(f"    🎯 Event: {result_item.get('event_title', 'N/A')}")
                print(f"    🏆 Position: {position}")
                print(f"    📅 Year: {result_item.get('year', 'N/A')} ({result_item.get('season', 'N/A')})")
                print()
            
            return result.data
        except Exception as e:
            print(f"❌ Error fetching results: {e}")
            return []
    
    def display_hosts_data():
        """Display hosts data"""
        try:
            supabase = get_supabase_client()
            result = supabase.table('hosts').select('*').limit(50).execute()
            
            print("\n🏛️ HOST CITIES DATA")
            print("=" * 80)
            print(f"📊 Total records fetched: {len(result.data)}")
            print("\n📋 Olympic Host Cities:")
            print("-" * 80)
            
            for i, host in enumerate(result.data[:10], 1):
                season_emoji = "☀️" if host.get('season') == 'Summer' else "❄️"
                print(f"{i:2d}. {season_emoji} {host.get('city', 'N/A')}, {host.get('country', 'N/A')}")
                print(f"    📅 Year: {host.get('year', 'N/A')}")
                print(f"    🌡️ Season: {host.get('season', 'N/A')}")
                print(f"    ⏱️ Duration: {host.get('duration_days', 'N/A')} days")
                print(f"    📆 Dates: {host.get('start_date', 'N/A')} to {host.get('end_date', 'N/A')}")
                print()
            
            return result.data
        except Exception as e:
            print(f"❌ Error fetching hosts: {e}")
            return []
    
    def main():
        print("🏆 OLYMPIC DATABASE DATA FETCHER")
        print("=" * 80)
        print("Fetching data from all Olympic tables...")
        print()
        
        # Fetch all data
        athletes = display_athletes_data()
        medals = display_medals_data()
        results = display_results_data()
        hosts = display_hosts_data()
        
        # Summary
        print("\n📈 SUMMARY")
        print("=" * 80)
        print(f"🏃‍♂️ Athletes: {len(athletes)} records")
        print(f"🏅 Medals: {len(medals)} records")
        print(f"📊 Results: {len(results)} records")
        print(f"🏛️ Hosts: {len(hosts)} records")
        print("\n✅ Data fetching completed successfully!")
        
        return {
            'athletes': athletes,
            'medals': medals,
            'results': results,
            'hosts': hosts
        }
    
    if __name__ == "__main__":
        data = main()
        
except ImportError as e:
    print(f"❌ Import error: {e}")
    print("💡 Make sure you're in the backend directory and dependencies are installed")
except Exception as e:
    print(f"❌ Error: {e}")
