import React, { useState, useEffect } from 'react';
import { olympicDataService } from '../services/api';
import '../styles/CountryPredictions.css';

const CountryPredictions = () => {
  const [country, setCountry] = useState('France');
  const [year, setYear] = useState(2024);
  const [model, setModel] = useState('ma');
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [topCountries, setTopCountries] = useState([]);
  const [topLoading, setTopLoading] = useState(false);

  const predictCountry = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await olympicDataService.predictCountryMedals(country, year, model);
      setPrediction(response.data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadTopCountries = async () => {
    setTopLoading(true);
    try {
      const response = await olympicDataService.predictTopCountries(25, year, model);
      setTopCountries(response.data.data);
    } catch (err) {
      console.error('Erreur lors du chargement du top des pays:', err);
    } finally {
      setTopLoading(false);
    }
  };

  useEffect(() => {
    loadTopCountries();
  }, [year, model]);

  const getMedalIcon = (type) => {
    switch (type) {
      case 'gold': return '🥇';
      case 'silver': return '🥈';
      case 'bronze': return '🥉';
      default: return '🏅';
    }
  };

  const getModelName = (modelCode) => {
    switch (modelCode) {
      case 'ma': return 'Moyenne Mobile';
      case 'es': return 'Lissage Exponentiel';
      case 'best': return 'Meilleur Modèle';
      case 'second': return 'Deuxième Modèle';
      default: return modelCode;
    }
  };

  return (
    <div className="country-predictions">
      <div className="prediction-controls">
        <h3>Prédictions par Pays</h3>
        <div className="controls-row">
          <div className="control-group">
            <label>Pays:</label>
            <input
              type="text"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              placeholder="Nom du pays"
            />
          </div>
          <div className="control-group">
            <label>Année:</label>
            <input
              type="number"
              value={year}
              onChange={(e) => setYear(parseInt(e.target.value))}
              min="2020"
              max="2030"
            />
          </div>
          <div className="control-group">
            <label>Modèle:</label>
            <select value={model} onChange={(e) => setModel(e.target.value)}>
              <option value="ma">Moyenne Mobile</option>
              <option value="es">Lissage Exponentiel</option>
              <option value="best">Meilleur Modèle</option>
              <option value="second">Deuxième Modèle</option>
            </select>
          </div>
          <button onClick={predictCountry} disabled={loading}>
            {loading ? 'Prédiction...' : 'Prédire'}
          </button>
        </div>
      </div>

      {error && (
        <div className="error-message">
          ❌ Erreur: {error}
        </div>
      )}

      {prediction && (
        <div className="prediction-result">
          <h4>Prédiction pour {prediction.country} en {prediction.year}</h4>
          <div className="medal-prediction">
            <div className="medal-item gold">
              <span className="medal-icon">🥇</span>
              <span className="medal-count">{prediction.gold}</span>
              <span className="medal-label">Or</span>
            </div>
            <div className="medal-item silver">
              <span className="medal-icon">🥈</span>
              <span className="medal-count">{prediction.silver}</span>
              <span className="medal-label">Argent</span>
            </div>
            <div className="medal-item bronze">
              <span className="medal-icon">🥉</span>
              <span className="medal-count">{prediction.bronze}</span>
              <span className="medal-label">Bronze</span>
            </div>
            <div className="medal-item total">
              <span className="medal-icon">🏅</span>
              <span className="medal-count">{prediction.total}</span>
              <span className="medal-label">Total</span>
            </div>
          </div>
          <div className="model-info">
            Modèle utilisé: {getModelName(model)}
          </div>
        </div>
      )}

      <div className="top-countries-section">
        <h4>Top 25 des Pays Prédits</h4>
        {topLoading ? (
          <div className="loading">Chargement du classement...</div>
        ) : (
          <div className="top-countries-list">
            {topCountries.map((country, index) => (
              <div key={index} className="country-rank-item">
                <div className="rank">#{index + 1}</div>
                <div className="country-name">{country.country}</div>
                <div className="medals-summary">
                  <span className="gold">🥇 {country.gold}</span>
                  <span className="silver">🥈 {country.silver}</span>
                  <span className="bronze">🥉 {country.bronze}</span>
                  <span className="total">🏅 {country.total}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CountryPredictions;
