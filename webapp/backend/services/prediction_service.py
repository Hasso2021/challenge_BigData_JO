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


DATA_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "data", "clean"))
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
        return pd.read_csv(path)
    except Exception:
        return None


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
        # 1) try pipeline models in webapp/backend/models
        if joblib:
            if os.path.exists(COUNTRY_BEST):
                try:
                    m = joblib.load(COUNTRY_BEST)
                    pipeline = m['model'] if isinstance(m, dict) and 'model' in m else m
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
                except Exception:
                    pass

        df = _safe_read_csv(CSV_MEDALS)
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
        # Try model-based top25
        if joblib:
            topm = None
            if os.path.exists(TOP25_BEST):
                try:
                    topm = joblib.load(TOP25_BEST)
                except Exception:
                    topm = None
            if topm is None and os.path.exists(TOP25_SECOND):
                try:
                    topm = joblib.load(TOP25_SECOND)
                except Exception:
                    topm = None
            if topm is not None:
                try:
                    pipeline = topm['model'] if isinstance(topm, dict) and 'model' in topm else topm
                    countries = pd.Series(df['country'].unique())
                    X = pd.DataFrame({'country': countries, 'year': year})
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
                except Exception:
                    pass

        df = _safe_read_csv(CSV_MEDALS)
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
            rows.append(_clamp_nonneg({"country": country, "gold": gold, "silver": silver, "bronze": bronze}))

        rows.sort(key=lambda r: r["total"], reverse=True)
        return rows[:top_n]

    # --------------------- ATHLETES ---------------------
    @staticmethod
    def predict_athlete_medals(limit: int = 50) -> List[Dict[str, Any]]:
        """
        Very simple heuristic:
        - Aggregate historical athlete medals and compute a probability of winning at next Games.
        """
        df = _safe_read_csv(CSV_MEDALS)
        if df is None or "participant_type" not in df.columns or "athlete" not in df.columns:
            return []

        df_ath = df[df["participant_type"] == "Athlete"].copy()
        if df_ath.empty:
            return []

        agg = df_ath.groupby("athlete")[["gold", "silver", "bronze"]].sum()
        agg["total"] = agg["gold"] + agg["silver"] + agg["bronze"]
        top = agg.sort_values("total", ascending=False).head(limit)

        out = []
        for athlete, row in top.iterrows():
            total = int(row["total"])
            # mock probability from historical success
            prob = min(0.95, 0.05 + total * 0.03)
            out.append({
                "athlete": athlete,
                "gold": int(row["gold"]),
                "silver": int(row["silver"]),
                "bronze": int(row["bronze"]),
                "prob_medal": round(prob, 2),
            })
        return out
