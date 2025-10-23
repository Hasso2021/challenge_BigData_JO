"""
Train simple models to predict country medal totals per year.
This script creates three models and saves the best and second-best in models/trained_models.

Usage:
  python models/train_country_models.py

"""
import os
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_absolute_error
import joblib
from sklearn.preprocessing import OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline

ROOT = os.path.dirname(os.path.dirname(__file__))
CSV = os.path.join(ROOT, 'data', 'clean', 'olympic_medals_clean_v2.csv')
OUT_DIR = os.path.join(ROOT, 'webapp', 'backend', 'models')
os.makedirs(OUT_DIR, exist_ok=True)


def prepare_country_year(df):
    # aggregate medals per country-year
    agg = df.groupby(['country', 'year'])[['gold', 'silver', 'bronze']].sum().reset_index()
    agg['total'] = agg['gold'] + agg['silver'] + agg['bronze']
    # create lag feature: previous year total for same country
    agg = agg.sort_values(['country', 'year'])
    agg['prev_total'] = agg.groupby('country')['total'].shift(1).fillna(0)
    agg['mean_prev_3'] = agg.groupby('country')['total'].shift(1).rolling(3, min_periods=1).mean().reset_index(level=0, drop=True).fillna(0)
    return agg.dropna()


def main():
    df = pd.read_csv(CSV)
    agg = prepare_country_year(df)
    features = ['country', 'year', 'prev_total', 'mean_prev_3']
    X = agg[features]
    y = agg['total']

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    preproc = ColumnTransformer([
        ('country_ohe', OneHotEncoder(handle_unknown='ignore', sparse_output=False), ['country'])
    ], remainder='passthrough')

    models = {
        'rf': RandomForestRegressor(n_estimators=100, random_state=42),
        'gb': GradientBoostingRegressor(n_estimators=100, random_state=42),
        'lr': LinearRegression()
    }

    results = []
    for name, model in models.items():
        pipe = Pipeline([('pre', preproc), ('model', model)])
        pipe.fit(X_train, y_train)
        preds = pipe.predict(X_test)
        mae = mean_absolute_error(y_test, preds)
        path = os.path.join(OUT_DIR, f'country_{name}.joblib')
        joblib.dump({'model': pipe, 'mae': mae}, path)
        results.append((name, mae, path))
        print(f"Trained {name} -> MAE: {mae:.3f}")

    # sort by mae (lower is better)
    results.sort(key=lambda x: x[1])
    best, second = results[0], results[1]
    best_path = os.path.join(OUT_DIR, 'country_best.joblib')
    second_path = os.path.join(OUT_DIR, 'country_second.joblib')
    joblib.dump({'model': joblib.load(best[2])['model'], 'mae': best[1]}, best_path)
    joblib.dump({'model': joblib.load(second[2])['model'], 'mae': second[1]}, second_path)
    print(f"Best model: {best[0]} (MAE {best[1]:.3f}) saved to {best_path}")
    print(f"Second model: {second[0]} (MAE {second[1]:.3f}) saved to {second_path}")


if __name__ == '__main__':
    main()
