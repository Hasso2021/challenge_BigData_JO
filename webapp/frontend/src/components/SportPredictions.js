import React, { useState, useEffect } from 'react';
import { olympicDataService } from '../services/api';
import '../styles/SportPredictions.css';

const SportPredictions = () => {
  const [sport, setSport] = useState('');
  const [year, setYear] = useState(2024);
  const [limit, setLimit] = useState(20);
  const [sports, setSports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadSports = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await olympicDataService.predictSportPerformance(sport, year, limit);
      setSports(response.data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSports();
  }, [sport, year, limit]);

  const getSportIcon = (sportName) => {
    const sportIcons = {
      'Athletics': '🏃',
      'Swimming': '🏊',
      'Gymnastics': '🤸',
      'Cycling': '🚴',
      'Rowing': '🚣',
      'Sailing': '⛵',
      'Shooting': '🎯',
      'Boxing': '🥊',
      'Wrestling': '🤼',
      'Judo': '🥋',
      'Taekwondo': '🥋',
      'Weightlifting': '🏋️',
      'Tennis': '🎾',
      'Badminton': '🏸',
      'Table Tennis': '🏓',
      'Basketball': '🏀',
      'Volleyball': '🏐',
      'Football': '⚽',
      'Hockey': '🏑',
      'Handball': '🤾',
      'Water Polo': '🤽',
      'Rugby': '🏉',
      'Golf': '⛳',
      'Archery': '🏹',
      'Equestrian': '🏇',
      'Fencing': '🤺',
      'Canoeing': '🛶',
      'Kayaking': '🛶',
      'Synchronized Swimming': '🏊',
      'Diving': '🤽',
      'Trampoline': '🤸',
      'Rhythmic Gymnastics': '🤸',
      'Artistic Gymnastics': '🤸',
      'Modern Pentathlon': '🏃',
      'Triathlon': '🏃',
      'Marathon Swimming': '🏊',
      'BMX': '🚴',
      'Mountain Biking': '🚴',
      'Track Cycling': '🚴',
      'Road Cycling': '🚴'
    };
    
    return sportIcons[sportName] || '🏅';
  };

  const getPerformanceLevel = (total) => {
    if (total >= 50) return { level: 'Excellent', color: '#4caf50' };
    if (total >= 20) return { level: 'Bon', color: '#ff9800' };
    if (total >= 10) return { level: 'Moyen', color: '#ff5722' };
    return { level: 'Faible', color: '#f44336' };
  };

  return (
    <div className="sport-predictions">
      <div className="prediction-controls">
        <h3>Prédictions par Sport</h3>
        <div className="controls-row">
          <div className="control-group">
            <label>Sport (optionnel):</label>
            <input
              type="text"
              value={sport}
              onChange={(e) => setSport(e.target.value)}
              placeholder="Filtrer par sport..."
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
            <label>Limite:</label>
            <select value={limit} onChange={(e) => setLimit(parseInt(e.target.value))}>
              <option value={10}>Top 10</option>
              <option value={20}>Top 20</option>
              <option value={30}>Top 30</option>
              <option value={50}>Top 50</option>
            </select>
          </div>
          <button onClick={loadSports} disabled={loading}>
            {loading ? 'Chargement...' : 'Actualiser'}
          </button>
        </div>
      </div>

      {error && (
        <div className="error-message">
          ❌ Erreur: {error}
        </div>
      )}

      {loading && (
        <div className="loading-message">
          🔄 Chargement des prédictions par sport...
        </div>
      )}

      {!loading && sports.length > 0 && (
        <div className="sports-results">
          <h4>Performance Prédite par Sport</h4>
          <div className="sports-grid">
            {sports.map((sportData, index) => {
              const performance = getPerformanceLevel(sportData.total);
              return (
                <div key={index} className="sport-card">
                  <div className="sport-header">
                    <div className="sport-icon">{getSportIcon(sportData.sport)}</div>
                    <div className="sport-name">{sportData.sport}</div>
                    <div className="sport-rank">#{index + 1}</div>
                  </div>
                  
                  <div className="sport-medals">
                    <div className="medal-row gold">
                      <span className="medal-icon">🥇</span>
                      <span className="medal-count">{sportData.gold}</span>
                      <span className="medal-label">Or</span>
                    </div>
                    <div className="medal-row silver">
                      <span className="medal-icon">🥈</span>
                      <span className="medal-count">{sportData.silver}</span>
                      <span className="medal-label">Argent</span>
                    </div>
                    <div className="medal-row bronze">
                      <span className="medal-icon">🥉</span>
                      <span className="medal-count">{sportData.bronze}</span>
                      <span className="medal-label">Bronze</span>
                    </div>
                  </div>
                  
                  <div className="sport-performance">
                    <div className="total-medals">
                      <span className="total-count">{sportData.total}</span>
                      <span className="total-label">Médailles Total</span>
                    </div>
                    <div 
                      className="performance-level"
                      style={{ color: performance.color }}
                    >
                      {performance.level}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {!loading && sports.length === 0 && !error && (
        <div className="no-data">
          <div className="no-data-icon">🏅</div>
          <div className="no-data-text">
            Aucune donnée disponible pour les critères sélectionnés
          </div>
        </div>
      )}
    </div>
  );
};

export default SportPredictions;
