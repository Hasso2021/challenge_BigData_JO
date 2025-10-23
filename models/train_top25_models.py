"""Train models to predict total medals per (country, year) and save best/second pipelines.

Saves to: webapp/backend/models/top25_best.joblib and top25_second.joblib
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


def build_country_year_df(df):
    df = df.copy()
    df['total'] = df[['gold', 'silver', 'bronze']].sum(axis=1)
    agg = df.groupby(['country', 'year'])['total'].sum().reset_index()
    # compute previous year total and mean prev 3
    agg = agg.sort_values(['country', 'year'])
    agg['prev_total'] = agg.groupby('country')['total'].shift(1).fillna(0)
    agg['mean_prev_3'] = agg.groupby('country')['total'].shift(1).rolling(3, min_periods=1).mean().reset_index(level=0, drop=True).fillna(0)
    return agg


def train():
    df = pd.read_csv(DATA)
    agg = build_country_year_df(df)
    # drop rows with year NaN
    agg = agg.dropna(subset=['year'])

    features = ['country', 'year', 'prev_total', 'mean_prev_3']
    X = agg[features]
    y = agg['total']

    preproc = ColumnTransformer([
        ('country_ohe', OneHotEncoder(handle_unknown='ignore', sparse=False), ['country'])
    ], remainder='passthrough')

    models = [
        ('rf', RandomForestRegressor(n_estimators=100, random_state=42)),
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

    best_path = os.path.join(OUT_DIR, 'top25_best.joblib')
    second_path = os.path.join(OUT_DIR, 'top25_second.joblib')
    joblib.dump({'model': best[2], 'mae': best[0]}, best_path)
    joblib.dump({'model': second[2], 'mae': second[0]}, second_path)
    print(f"Saved best -> {best_path}")
    print(f"Saved second -> {second_path}")


if __name__ == '__main__':
    train()
