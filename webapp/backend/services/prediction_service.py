# webapp/backend/services/prediction_service.py
"""
Prediction service: loads models (if present) and provides simple prediction endpoints.
- Works even if no trained models exist (falls back to heuristics on CSVs).
- Two model options:
    * 'ma'  : Moving Average on recent Games (default)
    * 'es'  : Exponential Smoothing via pandas ewm
"""
 
import os
from typing import List, Dict, Any
 
try:
    import joblib
except Exception:
    joblib = None
 
try:
    import pandas as pd
except Exception:
    pd = None
 
 
DATA_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "..", "data", "clean"))
CSV_MEDALS = os.path.join(DATA_DIR, "olympic_medals_clean_v2.csv")          # medals by event/athlete
CSV_RESULTS = os.path.join(DATA_DIR, "olympic_results_clean.csv")            # historical summaries (optional)
 
MODELS_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'models'))
COUNTRY_BEST = os.path.join(MODELS_DIR, 'country_best.joblib')
COUNTRY_SECOND = os.path.join(MODELS_DIR, 'country_second.joblib')
TOP25_BEST = os.path.join(MODELS_DIR, 'top25_best.joblib')
TOP25_SECOND = os.path.join(MODELS_DIR, 'top25_second.joblib')
ATHLETES_BEST = os.path.join(MODELS_DIR, 'athletes_best.joblib')
ATHLETES_SECOND = os.path.join(MODELS_DIR, 'athletes_second.joblib')
 
 
def _safe_read_csv(path: str):
    if pd is None:
        return None
    if not os.path.exists(path):
        return None
    try:
        df = pd.read_csv(path)
        return df
    except Exception:
        return None
 
 
def _normalize_country_name(name: str) -> str:
    if not isinstance(name, str):
        return name
    n = name.strip()
    # basic normalization
    n = n.replace('\u00a0', ' ')
    n = ' '.join(n.split())
    return n
 
 
def _clean_medals_df(df):
    """Normalize and filter country names in medals df to avoid noisy values."""
    if df is None or df.empty:
        return df
    df = df.copy()
    if 'country' in df.columns:
        df['country'] = df['country'].astype(str).fillna('').apply(_normalize_country_name)
 
        # lowercase helper for mapping
        df['country_l'] = df['country'].str.lower()
 
        # mapping common historical aliases -> modern canonical or preferred labels
        alias_map = {
            'soviet union': 'USSR',
            'ussr': 'USSR',
            'unified team': 'Unified Team',
            'west germany': 'Germany',
            'german democratic republic (germany)': 'East Germany',
            "they pay": None,
            'n/a': None,
            'none': None,
            'unknown': None,
        }
 
        # apply alias map
        df['country_mapped'] = df['country_l'].map(alias_map)
        # where alias_map returned NaN, keep original
        df['country_final'] = df['country_mapped'].where(df['country_mapped'].notna(), df['country'])
 
        # drop rows mapped to None
        df = df[df['country_final'].notna()]
        # replace original column
        df['country'] = df['country_final']
        df = df.drop(columns=[c for c in ('country_l', 'country_mapped', 'country_final') if c in df.columns])
 
    return df
 
 
def _clamp_nonneg(d: Dict[str, Any]):
    for k in ("gold", "silver", "bronze"):
        d[k] = max(0, int(round(float(d.get(k, 0) or 0))))
    d["total"] = d["gold"] + d["silver"] + d["bronze"]
    return d
 
 
def _historical_props(df, country_name):
    """Return historical proportions (gold, silver, bronze) for a country from df."""
    if df is None or df.empty:
        return (1/3, 1/3, 1/3)
    try:
        df_country = df[df['country'].str.lower() == country_name.lower()]
        if df_country.empty:
            return (1/3, 1/3, 1/3)
        sums = df_country[['gold', 'silver', 'bronze']].sum()
        total = sums.sum()
        if total == 0:
            return (1/3, 1/3, 1/3)
        return (sums['gold']/total, sums['silver']/total, sums['bronze']/total)
    except Exception:
        return (1/3, 1/3, 1/3)
 
 
class PredictionService:
    """Public methods called by routes."""
 
    # cache loaded models
    _models: Dict[str, Any] = {}
 
    @classmethod
    def _load_models(cls):
        if cls._models:
            return
        if joblib is None:
            cls._models = {
                'country_best': None, 'country_second': None,
                'top25_best': None, 'top25_second': None,
                'athletes_best': None, 'athletes_second': None,
            }
            return
        def _safe_load(path):
            try:
                if os.path.exists(path):
                    return joblib.load(path)
            except Exception:
 
                return None
            return None
 
        cls._models = {
            'country_best': _safe_load(COUNTRY_BEST),
            'country_second': _safe_load(COUNTRY_SECOND),
            'top25_best': _safe_load(TOP25_BEST),
            'top25_second': _safe_load(TOP25_SECOND),
            'athletes_best': _safe_load(ATHLETES_BEST),
            'athletes_second': _safe_load(ATHLETES_SECOND),
        }
 
    # --------------------- COUNTRY ---------------------
 
    @staticmethod
    def predict_country_medals(country: str = "France", year: int = 2024, model: str = "ma") -> Dict[str, int]:
        # 1) try enhanced ML models in webapp/backend/models
        if joblib:
            if os.path.exists(COUNTRY_BEST):
                try:
                    model_data = joblib.load(COUNTRY_BEST)
                    if isinstance(model_data, dict) and 'model' in model_data and 'scaler' in model_data:
                        # Enhanced ML model
                        ml_model = model_data['model']
                        scaler = model_data['scaler']
                        feature_columns = model_data.get('feature_columns', [])
                        
                        # Country mapping for consistency
                        country_mapping = {
                            'France': 'France', 'United States of America': 'USA', 'USA': 'USA',
                            'China': 'China', 'People\'s Republic of China': 'China',
                            'Great Britain': 'Great Britain', 'Germany': 'Germany',
                            'Japan': 'Japan', 'Italy': 'Italy', 'Australia': 'Australia',
                            'Canada': 'Canada', 'Russia': 'Russia', 'Russian Federation': 'Russia'
                        }
                        
                        mapped_country = country_mapping.get(country, country)
                        
                        # Country-specific factors
                        country_factors = {
                            'USA': {'population': 331000000, 'gdp_per_capita': 65000, 'sports_culture': 0.9, 'olympic_tradition': 0.95},
                            'China': {'population': 1400000000, 'gdp_per_capita': 10000, 'sports_culture': 0.8, 'olympic_tradition': 0.7},
                            'Great Britain': {'population': 67000000, 'gdp_per_capita': 45000, 'sports_culture': 0.85, 'olympic_tradition': 0.9},
                            'France': {'population': 67000000, 'gdp_per_capita': 40000, 'sports_culture': 0.8, 'olympic_tradition': 0.85},
                            'Germany': {'population': 83000000, 'gdp_per_capita': 50000, 'sports_culture': 0.85, 'olympic_tradition': 0.9},
                            'Japan': {'population': 125000000, 'gdp_per_capita': 40000, 'sports_culture': 0.75, 'olympic_tradition': 0.8},
                            'Italy': {'population': 60000000, 'gdp_per_capita': 35000, 'sports_culture': 0.8, 'olympic_tradition': 0.85},
                            'Australia': {'population': 25000000, 'gdp_per_capita': 55000, 'sports_culture': 0.9, 'olympic_tradition': 0.8},
                            'Canada': {'population': 38000000, 'gdp_per_capita': 45000, 'sports_culture': 0.8, 'olympic_tradition': 0.75},
                            'Russia': {'population': 145000000, 'gdp_per_capita': 12000, 'sports_culture': 0.85, 'olympic_tradition': 0.9}
                        }
                        
                        factors = country_factors.get(mapped_country, {
                            'population': 50000000, 'gdp_per_capita': 20000, 
                            'sports_culture': 0.5, 'olympic_tradition': 0.5
                        })
                        
                        # Create feature vector for prediction
                        features = {
                            'avg_recent_3': 0, 'trend': 0, 'consistency': 0, 'peak_performance': 0,
                            'years_since_last': 4, 'population': factors['population'],
                            'gdp_per_capita': factors['gdp_per_capita'],
                            'sports_culture': factors['sports_culture'],
                            'olympic_tradition': factors['olympic_tradition'],
                            'is_host': 1 if mapped_country == 'France' else 0,
                            'is_summer': 1, 'year_normalized': (year - 1990) / 30
                        }
                        
                        # Convert to array and scale
                        import numpy as np
                        feature_array = np.array([features[col] for col in feature_columns]).reshape(1, -1)
                        feature_array_scaled = scaler.transform(feature_array)
                        
                        # Make prediction
                        predicted_total = max(0, ml_model.predict(feature_array_scaled)[0])
                        
                        # Distribute medals based on country-specific ratios
                        if mapped_country in ['USA', 'China', 'Germany']:
                            gold_ratio, silver_ratio, bronze_ratio = 0.5, 0.3, 0.2
                        elif mapped_country in ['France', 'Great Britain', 'Japan']:
                            gold_ratio, silver_ratio, bronze_ratio = 0.4, 0.35, 0.25
                        else:
                            gold_ratio, silver_ratio, bronze_ratio = 0.4, 0.3, 0.3
                        
                        gold = int(round(predicted_total * gold_ratio))
                        silver = int(round(predicted_total * silver_ratio))
                        bronze = int(round(predicted_total * bronze_ratio))
                        
                        # Ensure total matches
                        total = gold + silver + bronze
                        if total != int(round(predicted_total)):
                            bronze += int(round(predicted_total)) - total
                        
                        return _clamp_nonneg({
                            'country': country, 'year': year, 
                            'gold': max(0, gold), 'silver': max(0, silver), 'bronze': max(0, bronze)
                        })
                    else:
                        # Legacy model format
                        pipeline = model_data['model'] if isinstance(model_data, dict) and 'model' in model_data else model_data
                        X_row = pd.DataFrame([{'country': country, 'year': int(year), 'prev_total': 0, 'mean_prev_3': 0}])
                        preds = pipeline.predict(X_row)
                        total = max(0, float(preds[0]))
                        g_prop, s_prop, b_prop = (1/3, 1/3, 1/3)
                        try:
                            g_prop, s_prop, b_prop = _historical_props(_safe_read_csv(CSV_MEDALS), country)
                        except Exception:
                            pass
                        gold = int(round(total * g_prop))
                        silver = int(round(total * s_prop))
                        bronze = int(round(total * b_prop))
                        return _clamp_nonneg({'country': country, 'year': year, 'gold': gold, 'silver': silver, 'bronze': bronze})
                except Exception as e:
                    print(f"Error using enhanced model: {e}")
                    pass
 
        df = _safe_read_csv(CSV_MEDALS)
        df = _clean_medals_df(df)
        if df is None:
            return _clamp_nonneg({"country": country, "year": year, "gold": 0, "silver": 0, "bronze": 0})
 
        # Normalize textual fields
        if "country" in df.columns:
            df["country_norm"] = df["country"].astype(str).str.strip().str.lower()
        else:
            df["country_norm"] = ""
 
        for col in ("noc", "country_code"):
            if col in df.columns:
                df[col] = df[col].astype(str).str.strip().str.upper()
 
        country_norm = country.strip().lower()
 
        # Try matching by name first
        d = df[df["country_norm"] == country_norm]
        # If empty, try NOC code fallback (FRA for France, USA, etc.)
        noc_map = {"france": "FRA", "united states": "USA", "great britain": "GBR",
               "china": "CHN", "germany": "GER", "italy": "ITA", "spain": "ESP"}
        if d.empty and "noc" in df.columns and country_norm in noc_map:
             d = df[df["noc"] == noc_map[country_norm]]
 
        # If still empty, try country_code
        if d.empty and "country_code" in df.columns and country_norm in noc_map:
            d = df[df["country_code"] == noc_map[country_norm]]
 
        if d.empty:
            return _clamp_nonneg({"country": country, "year": year, "gold": 0, "silver": 0, "bronze": 0})
 
        # Aggregate by year
        needed = {"gold", "silver", "bronze", "year"}
        if not needed.issubset(d.columns):
            return _clamp_nonneg({"country": country, "year": year, "gold": 0, "silver": 0, "bronze": 0})
 
        d = d.sort_values("year")
        g = d.groupby("year")[["gold", "silver", "bronze"]].sum()
 
        window = min(5, len(g))
        if window == 0:
            return _clamp_nonneg({"country": country, "year": year, "gold": 0, "silver": 0, "bronze": 0})
 
        if model == "es":
            gold   = float(g["gold"].ewm(alpha=0.5).mean().iloc[-1])
            silver = float(g["silver"].ewm(alpha=0.5).mean().iloc[-1])
            bronze = float(g["bronze"].ewm(alpha=0.5).mean().iloc[-1])
        else:
            gold   = float(g["gold"].tail(window).mean())
            silver = float(g["silver"].tail(window).mean())
            bronze = float(g["bronze"].tail(window).mean())
 
        return _clamp_nonneg({"country": country, "year": year, "gold": gold, "silver": silver, "bronze": bronze})
 
    # --------------------- TOP 25 ---------------------
    @staticmethod
    def predict_top_countries(top_n: int = 25, year: int = 2024, model: str = "ma") -> List[Dict[str, Any]]:
        """
        Return list of dicts: [{country, gold, silver, bronze, total}, ...] length == top_n
        """
        # Load CSV early (used by both model and fallback code)
        df = _safe_read_csv(CSV_MEDALS)
        df = _clean_medals_df(df)
 
        # Try enhanced ML model-based top25 when available
        if model in ("best", "second"):
            try:
                # Load enhanced model directly
                if os.path.exists(TOP25_BEST):
                    model_data = joblib.load(TOP25_BEST)
                    if isinstance(model_data, dict) and 'model' in model_data and 'scaler' in model_data:
                        ml_model = model_data['model']
                        scaler = model_data['scaler']
                        feature_columns = model_data.get('feature_columns', [])
                        
                        # Country factors for prediction
                        country_factors = {
                            'USA': {'population': 331000000, 'gdp_per_capita': 65000, 'sports_culture': 0.9, 'olympic_tradition': 0.95},
                            'China': {'population': 1400000000, 'gdp_per_capita': 10000, 'sports_culture': 0.8, 'olympic_tradition': 0.7},
                            'Great Britain': {'population': 67000000, 'gdp_per_capita': 45000, 'sports_culture': 0.85, 'olympic_tradition': 0.9},
                            'France': {'population': 67000000, 'gdp_per_capita': 40000, 'sports_culture': 0.8, 'olympic_tradition': 0.85},
                            'Germany': {'population': 83000000, 'gdp_per_capita': 50000, 'sports_culture': 0.85, 'olympic_tradition': 0.9},
                            'Japan': {'population': 125000000, 'gdp_per_capita': 40000, 'sports_culture': 0.75, 'olympic_tradition': 0.8},
                            'Italy': {'population': 60000000, 'gdp_per_capita': 35000, 'sports_culture': 0.8, 'olympic_tradition': 0.85},
                            'Australia': {'population': 25000000, 'gdp_per_capita': 55000, 'sports_culture': 0.9, 'olympic_tradition': 0.8},
                            'Canada': {'population': 38000000, 'gdp_per_capita': 45000, 'sports_culture': 0.8, 'olympic_tradition': 0.75},
                            'Russia': {'population': 145000000, 'gdp_per_capita': 12000, 'sports_culture': 0.85, 'olympic_tradition': 0.9},
                            'Norway': {'population': 5000000, 'gdp_per_capita': 75000, 'sports_culture': 0.9, 'olympic_tradition': 0.8},
                            'Sweden': {'population': 10000000, 'gdp_per_capita': 55000, 'sports_culture': 0.8, 'olympic_tradition': 0.8},
                            'Netherlands': {'population': 17000000, 'gdp_per_capita': 55000, 'sports_culture': 0.8, 'olympic_tradition': 0.75},
                            'South Korea': {'population': 51000000, 'gdp_per_capita': 30000, 'sports_culture': 0.8, 'olympic_tradition': 0.7},
                            'Spain': {'population': 47000000, 'gdp_per_capita': 30000, 'sports_culture': 0.75, 'olympic_tradition': 0.7},
                            'Brazil': {'population': 210000000, 'gdp_per_capita': 8000, 'sports_culture': 0.8, 'olympic_tradition': 0.6}
                        }
                        
                        results = []
                        import numpy as np
                        
                        for country, factors in country_factors.items():
                            # Create feature vector for prediction
                            features = {
                                'avg_recent_3': 0, 'trend': 0, 'consistency': 0, 'peak_performance': 0,
                                'years_since_last': 4, 'population': factors['population'],
                                'gdp_per_capita': factors['gdp_per_capita'],
                                'sports_culture': factors['sports_culture'],
                                'olympic_tradition': factors['olympic_tradition'],
                                'is_host': 1 if country == 'France' else 0,
                                'is_summer': 1, 'year_normalized': (year - 1990) / 30
                            }
                            
                            # Convert to array and scale
                            feature_array = np.array([features[col] for col in feature_columns]).reshape(1, -1)
                            feature_array_scaled = scaler.transform(feature_array)
                            
                            # Make prediction
                            predicted_total = max(0, ml_model.predict(feature_array_scaled)[0])
                            
                            # Distribute medals based on country-specific ratios
                            if country in ['USA', 'China', 'Germany']:
                                gold_ratio, silver_ratio, bronze_ratio = 0.5, 0.3, 0.2
                            elif country in ['France', 'Great Britain', 'Japan']:
                                gold_ratio, silver_ratio, bronze_ratio = 0.4, 0.35, 0.25
                            else:
                                gold_ratio, silver_ratio, bronze_ratio = 0.4, 0.3, 0.3
                            
                            gold = int(round(predicted_total * gold_ratio))
                            silver = int(round(predicted_total * silver_ratio))
                            bronze = int(round(predicted_total * bronze_ratio))
                            
                            # Ensure total matches
                            total = gold + silver + bronze
                            if total != int(round(predicted_total)):
                                bronze += int(round(predicted_total)) - total
                            
                            results.append({
                                'country': country, 'year': year, 
                                'gold': max(0, gold), 'silver': max(0, silver), 'bronze': max(0, bronze),
                                'total': max(0, gold + silver + bronze)
                            })
                        
                        # Sort by total and return top N
                        results.sort(key=lambda x: x['total'], reverse=True)
                        return results[:top_n]
                    else:
                        # Legacy model format
                        pipeline = model_data['model'] if isinstance(model_data, dict) and 'model' in model_data else model_data
                        if df is not None and 'country' in df.columns:
                            countries = pd.Series(df['country'].dropna().unique())
                            X = pd.DataFrame({'country': countries, 'year': [int(year)] * len(countries)})
                            preds = pipeline.predict(X)
                            df_out = pd.DataFrame({'country': countries, 'total': preds})
                            df_out = df_out.sort_values('total', ascending=False).head(top_n)
                            results = []
                            for _, r in df_out.iterrows():
                                c = r['country']
                                total = max(0, int(round(float(r['total']))))
                                g_prop, s_prop, b_prop = _historical_props(df, c)
                                gold = int(round(total * g_prop))
                                silver = int(round(total * s_prop))
                                bronze = int(round(total * b_prop))
                                results.append({'country': c, 'year': year, 'gold': gold, 'silver': silver, 'bronze': bronze, 'note': 'model_top'})
                            return results
            except Exception as e:
                print(f"Error using enhanced top25 model: {e}")
                # fallback to historical aggregation below
                pass
 
        if df is None:
            return []
 
        cols_needed = {"country", "year", "gold", "silver", "bronze"}
        if not set(cols_needed).issubset(df.columns):
            return []
 
        d = df.sort_values("year")
        g = d.groupby(["year", "country"])[["gold", "silver", "bronze"]].sum().reset_index()
 
        # moving average / exponential smoothing by country
        rows = []
        for country, sub in g.groupby("country"):
            sub = sub.sort_values("year")
            if model == "es":
                gold   = float(sub["gold"].ewm(alpha=0.5).mean().iloc[-1])
                silver = float(sub["silver"].ewm(alpha=0.5).mean().iloc[-1])
                bronze = float(sub["bronze"].ewm(alpha=0.5).mean().iloc[-1])
            else:
                w = min(5, len(sub))
                gold   = float(sub["gold"].tail(w).mean())
                silver = float(sub["silver"].tail(w).mean())
                bronze = float(sub["bronze"].tail(w).mean())
            
            # Map old country names to modern names
            country_mapping = {
                'USSR': 'Russia',
                'Soviet Union': 'Russia', 
                'Unified Team': 'Russia',
                'East Germany': 'Germany',
                'West Germany': 'Germany',
                'Yugoslavia': 'Serbia',
                'Czechoslovakia': 'Czech Republic',
                'People\'s Republic of China': 'China',
                'United States of America': 'USA',
                'Russian Federation': 'Russia'
            }
            modern_country = country_mapping.get(country, country)
            
            rows.append(_clamp_nonneg({"country": modern_country, "gold": gold, "silver": silver, "bronze": bronze}))

        rows.sort(key=lambda r: r["total"], reverse=True)
        return rows[:top_n]
 
    # --------------------- ATHLETES ---------------------
    @staticmethod
    def predict_athlete_medals(limit: int = 50, model: str = "best") -> List[Dict[str, Any]]:
        """
        Very simple heuristic:
        - Aggregate historical athlete medals and compute a probability of winning at next Games.
        """
        # Accept model selection and try to use trained athlete pipelines if present
        def _agg_athlete_df(df):
            df_ath = df[df["participant_type"] == "Athlete"].copy()
            if df_ath.empty:
                return None
            agg = df_ath.groupby(["athlete", "country", "sport"] , dropna=False)[["gold", "silver", "bronze"]].sum().reset_index()
            agg["total"] = agg["gold"] + agg["silver"] + agg["bronze"]
            
            # Map old country names to modern names
            country_mapping = {
                'USSR': 'Russia',
                'Soviet Union': 'Russia', 
                'Unified Team': 'Russia',
                'East Germany': 'Germany',
                'West Germany': 'Germany',
                'Yugoslavia': 'Serbia',
                'Czechoslovakia': 'Czech Republic',
                'People\'s Republic of China': 'China',
                'United States of America': 'USA',
                'Russian Federation': 'Russia'
            }
            agg["country"] = agg["country"].map(country_mapping).fillna(agg["country"])
            
            return agg
 
        # default model param support (best/second or heuristic)
        def _inner(limit:int=50, year:int=2024, model_choice:str="best"):
            df = _safe_read_csv(CSV_MEDALS)
            df = _clean_medals_df(df)
            if df is None or "participant_type" not in df.columns or "athlete" not in df.columns:
                return []
 
            athletes_df = _agg_athlete_df(df)
            if athletes_df is None:
                return []
 
            # try to use a trained athletes pipeline if available
            try:
                PredictionService._load_models()
                mdl = PredictionService._models.get(f"athletes_{model_choice}")
                if mdl is not None and isinstance(mdl, dict) and mdl.get('model') is not None:
                    pipe = mdl['model']
                    # prepare input columns expected by the pipeline
                    X = athletes_df[["athlete", "country", "sport"]].copy()
                    # add year/hist_total if pipeline expects passthrough
                    X["year"] = int(year)
                    X["hist_total"] = athletes_df["total"]
                    try:
                        scores = pipe.predict(X)
                        athletes_df["score"] = scores
                        out = athletes_df.sort_values("score", ascending=False).head(limit)
                        return out[["athlete", "country", "sport", "score", "total"]].to_dict(orient="records")
                    except Exception:
                        # fallback to heuristic
                        pass
            except Exception:
                pass
 
            # fallback heuristic: rank by historical total medals and produce a normalized score
            out = athletes_df.sort_values("total", ascending=False).head(limit).copy()
            max_total = out["total"].max() if not out.empty else 1
            out["score"] = out["total"] / (max_total if max_total > 0 else 1)
            return out[["athlete", "country", "sport", "score", "total"]].to_dict(orient="records")
 
        # expose outer with default parameters
        return _inner(limit=limit, year=2024, model_choice="best")