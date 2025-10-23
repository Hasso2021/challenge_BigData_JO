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

MODELS_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "models"))
COUNTRY_MODEL_PATH = os.path.join(MODELS_DIR, "country_medals.joblib")
TOP25_MODEL_PATH   = os.path.join(MODELS_DIR, "top25_medals.joblib")
ATHLETE_MODEL_PATH = os.path.join(MODELS_DIR, "athlete_medals.joblib")


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


class PredictionService:
    """Public methods called by routes."""

    # --------------------- COUNTRY ---------------------

    @staticmethod
    def predict_country_medals(country: str = "France", year: int = 2024, model: str = "ma") -> Dict[str, int]:
        # 1) joblib model if available
        if joblib and os.path.exists(COUNTRY_MODEL_PATH):
            try:
                model_obj = joblib.load(COUNTRY_MODEL_PATH)
                preds = model_obj.predict([[country, year]])
                out = {"country": country, "year": year,
                       "gold": int(preds[0][0]), "silver": int(preds[0][1]), "bronze": int(preds[0][2])}
                return _clamp_nonneg(out)
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
        # joblib model first
        if joblib and os.path.exists(TOP25_MODEL_PATH):
            try:
                model_obj = joblib.load(TOP25_MODEL_PATH)
                preds = model_obj.predict([[year]])  # adjust if model expects more features
                # assume preds is a list of dicts already
                return [_clamp_nonneg(x) for x in preds][:top_n]
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
