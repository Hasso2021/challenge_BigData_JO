"""Train models to predict an athlete score/probability for upcoming Games.

Saves to: webapp/backend/models/athletes_best.joblib and athletes_second.joblib
"""
import os
import joblib
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from sklearn.linear_model import LinearRegression
from sklearn.preprocessing import OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.metrics import mean_absolute_error


BASE = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
DATA = os.path.join(BASE, 'data', 'clean', 'olympic_medals_clean_v2.csv')
OUT_DIR = os.path.join(BASE, 'webapp', 'backend', 'models')
os.makedirs(OUT_DIR, exist_ok=True)


def build_athlete_df(df):
    df = df.copy()
    df = df[df['participant_type'] == 'Athlete']
    df['total'] = df[['gold', 'silver', 'bronze']].sum(axis=1)
    agg = df.groupby(['athlete', 'country', 'sport', 'year'])['total'].sum().reset_index()
    # historical aggregate per athlete
    hist = agg.groupby('athlete')['total'].sum().reset_index().rename(columns={'total': 'hist_total'})
    agg = agg.merge(hist, on='athlete', how='left')
    # target: proxy score
    agg['target'] = (0.05 + 0.03 * agg['hist_total']).clip(0, 0.95)
    return agg


def train(quick: bool = False, top_k: int = 1000):
    df = pd.read_csv(DATA)
    agg = build_athlete_df(df)
    if quick:
        # focus on top historical athletes to reduce dataset size
        agg = agg.sort_values('hist_total', ascending=False).head(top_k)
    features = ['athlete', 'country', 'sport', 'year', 'hist_total']
    X = agg[features]
    y = agg['target']

    cat_cols = ['athlete', 'country', 'sport']
    preproc = ColumnTransformer([
        ('cat', OneHotEncoder(handle_unknown='ignore', sparse_output=False), cat_cols)
    ], remainder='passthrough')

    # Use faster, lower-cost estimators in quick mode
    if quick:
        models = [
            ('rf', RandomForestRegressor(n_estimators=50, random_state=42, n_jobs=-1)),
            ('gb', GradientBoostingRegressor(n_estimators=50, random_state=42)),
            ('lr', LinearRegression())
        ]
    else:
        models = [
            ('rf', RandomForestRegressor(n_estimators=100, random_state=42, n_jobs=-1)),
            ('gb', GradientBoostingRegressor(random_state=42)),
            ('lr', LinearRegression())
        ]

    results = []
    for name, m in models:
        pipe = Pipeline([('pre', preproc), ('model', m)])
        pipe.fit(X, y)
        preds = pipe.predict(X)
        mae = mean_absolute_error(y, preds)
        results.append((mae, name, pipe))
        print(f"Trained {name} -> MAE: {mae:.3f}")

    results.sort(key=lambda r: r[0])
    best, second = results[0], results[1]

    # choose filenames depending on quick/full mode
    if quick:
        best_path = os.path.join(OUT_DIR, 'athletes_quick.joblib')
        second_path = os.path.join(OUT_DIR, 'athletes_quick_second.joblib')
    else:
        best_path = os.path.join(OUT_DIR, 'athletes_best.joblib')
        second_path = os.path.join(OUT_DIR, 'athletes_second.joblib')

    joblib.dump({'model': best[2], 'mae': best[0]}, best_path)
    joblib.dump({'model': second[2], 'mae': second[0]}, second_path)
    print(f"Saved best -> {best_path}")
    print(f"Saved second -> {second_path}")


if __name__ == '__main__':
    import argparse
    parser = argparse.ArgumentParser(description='Train athlete models')
    parser.add_argument('--quick', action='store_true', help='Run a fast training (sample top athletes, fewer estimators)')
    parser.add_argument('--top-k', type=int, default=1000, help='Number of top athletes to keep in quick mode')
    args = parser.parse_args()
    train(quick=args.quick, top_k=args.top_k)
