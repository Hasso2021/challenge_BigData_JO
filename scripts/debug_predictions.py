import os, sys
# Ensure we can import the backend services package regardless of current working directory
_THIS_DIR = os.path.dirname(os.path.abspath(__file__))
_PROJECT_ROOT = os.path.abspath(os.path.join(_THIS_DIR, '..'))
_BACKEND_PATH = os.path.join(_PROJECT_ROOT, 'webapp', 'backend')
sys.path.insert(0, _BACKEND_PATH)
from services.prediction_service import PredictionService, CSV_MEDALS
import pandas as pd

print('CSV path:', CSV_MEDALS)
try:
    df = pd.read_csv(CSV_MEDALS)
    print('CSV columns:', df.columns.tolist())
    print('Unique countries sample:', df['country'].dropna().unique()[:10])
except Exception as e:
    print('CSV read error:', e)

PredictionService._load_models()
print('Loaded model keys:', list(PredictionService._models.keys()))
print('top25_best present:', PredictionService._models.get('top25_best') is not None)
print('top25_second present:', PredictionService._models.get('top25_second') is not None)
res = PredictionService.predict_top_countries(top_n=25, year=2024, model='best')
print('predict_top_countries result len:', len(res))
print(res[:5])
