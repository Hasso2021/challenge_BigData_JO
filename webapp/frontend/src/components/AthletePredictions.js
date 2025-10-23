import React, { useState, useEffect } from 'react';
import { olympicDataService } from '../services/api';
import '../styles/AthletePredictions.css';

const AthletePredictions = () => {
  const [athletes, setAthletes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [limit, setLimit] = useState(50);
  const [model, setModel] = useState('best');

  const loadAthletes = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await olympicDataService.predictAthleteMedals(limit, model);
      setAthletes(response.data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAthletes();
  }, [limit, model]);

  const getSportIcon = (sport) => {
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
      'Kayaking': '🛶'
    };
    
    return sportIcons[sport] || '🏅';
  };

  const getCountryFlag = (country) => {
    const countryFlags = {
      'France': '🇫🇷',
      'United States': '🇺🇸',
      'China': '🇨🇳',
      'Germany': '🇩🇪',
      'Great Britain': '🇬🇧',
      'Japan': '🇯🇵',
      'Australia': '🇦🇺',
      'Italy': '🇮🇹',
      'Spain': '🇪🇸',
      'Canada': '🇨🇦',
      'Brazil': '🇧🇷',
      'Russia': '🇷🇺',
      'South Korea': '🇰🇷',
      'Netherlands': '🇳🇱',
      'Sweden': '🇸🇪',
      'Norway': '🇳🇴',
      'Denmark': '🇩🇰',
      'Finland': '🇫🇮',
      'Switzerland': '🇨🇭',
      'Austria': '🇦🇹',
      'Belgium': '🇧🇪',
      'Poland': '🇵🇱',
      'Czech Republic': '🇨🇿',
      'Hungary': '🇭🇺',
      'Romania': '🇷🇴',
      'Bulgaria': '🇧🇬',
      'Croatia': '🇭🇷',
      'Serbia': '🇷🇸',
      'Slovenia': '🇸🇮',
      'Slovakia': '🇸🇰',
      'Ukraine': '🇺🇦',
      'Belarus': '🇧🇾',
      'Lithuania': '🇱🇹',
      'Latvia': '🇱🇻',
      'Estonia': '🇪🇪',
      'Moldova': '🇲🇩',
      'Georgia': '🇬🇪',
      'Armenia': '🇦🇲',
      'Azerbaijan': '🇦🇿',
      'Kazakhstan': '🇰🇿',
      'Uzbekistan': '🇺🇿',
      'Kyrgyzstan': '🇰🇬',
      'Tajikistan': '🇹🇯',
      'Turkmenistan': '🇹🇲',
      'Mongolia': '🇲🇳',
      'India': '🇮🇳',
      'Pakistan': '🇵🇰',
      'Bangladesh': '🇧🇩',
      'Sri Lanka': '🇱🇰',
      'Nepal': '🇳🇵',
      'Bhutan': '🇧🇹',
      'Maldives': '🇲🇻',
      'Afghanistan': '🇦🇫',
      'Iran': '🇮🇷',
      'Iraq': '🇮🇶',
      'Syria': '🇸🇾',
      'Lebanon': '🇱🇧',
      'Jordan': '🇯🇴',
      'Israel': '🇮🇱',
      'Palestine': '🇵🇸',
      'Saudi Arabia': '🇸🇦',
      'United Arab Emirates': '🇦🇪',
      'Qatar': '🇶🇦',
      'Bahrain': '🇧🇭',
      'Kuwait': '🇰🇼',
      'Oman': '🇴🇲',
      'Yemen': '🇾🇪',
      'Egypt': '🇪🇬',
      'Libya': '🇱🇾',
      'Tunisia': '🇹🇳',
      'Algeria': '🇩🇿',
      'Morocco': '🇲🇦',
      'Sudan': '🇸🇩',
      'Ethiopia': '🇪🇹',
      'Kenya': '🇰🇪',
      'Uganda': '🇺🇬',
      'Tanzania': '🇹🇿',
      'Rwanda': '🇷🇼',
      'Burundi': '🇧🇮',
      'South Africa': '🇿🇦',
      'Namibia': '🇳🇦',
      'Botswana': '🇧🇼',
      'Zimbabwe': '🇿🇼',
      'Zambia': '🇿🇲',
      'Malawi': '🇲🇼',
      'Mozambique': '🇲🇿',
      'Madagascar': '🇲🇬',
      'Mauritius': '🇲🇺',
      'Seychelles': '🇸🇨',
      'Comoros': '🇰🇲',
      'Djibouti': '🇩🇯',
      'Somalia': '🇸🇴',
      'Eritrea': '🇪🇷',
      'Ghana': '🇬🇭',
      'Nigeria': '🇳🇬',
      'Cameroon': '🇨🇲',
      'Central African Republic': '🇨🇫',
      'Chad': '🇹🇩',
      'Niger': '🇳🇪',
      'Mali': '🇲🇱',
      'Burkina Faso': '🇧🇫',
      'Senegal': '🇸🇳',
      'Gambia': '🇬🇲',
      'Guinea-Bissau': '🇬🇼',
      'Guinea': '🇬🇳',
      'Sierra Leone': '🇸🇱',
      'Liberia': '🇱🇷',
      'Ivory Coast': '🇨🇮',
      'Togo': '🇹🇬',
      'Benin': '🇧🇯',
      'Cape Verde': '🇨🇻',
      'São Tomé and Príncipe': '🇸🇹',
      'Equatorial Guinea': '🇬🇶',
      'Gabon': '🇬🇦',
      'Republic of the Congo': '🇨🇬',
      'Democratic Republic of the Congo': '🇨🇩',
      'Angola': '🇦🇴',
      'Zambia': '🇿🇲',
      'Malawi': '🇲🇼',
      'Mozambique': '🇲🇿',
      'Madagascar': '🇲🇬',
      'Mauritius': '🇲🇺',
      'Seychelles': '🇸🇨',
      'Comoros': '🇰🇲',
      'Djibouti': '🇩🇯',
      'Somalia': '🇸🇴',
      'Eritrea': '🇪🇷'
    };
    
    return countryFlags[country] || '🏳️';
  };

  const getScoreLevel = (score) => {
    if (score >= 0.8) return { level: 'Excellent', color: '#4caf50' };
    if (score >= 0.6) return { level: 'Très Bon', color: '#8bc34a' };
    if (score >= 0.4) return { level: 'Bon', color: '#ff9800' };
    if (score >= 0.2) return { level: 'Moyen', color: '#ff5722' };
    return { level: 'Faible', color: '#f44336' };
  };

  const getModelName = (modelCode) => {
    switch (modelCode) {
      case 'best': return 'Meilleur Modèle';
      case 'second': return 'Deuxième Modèle';
      default: return modelCode;
    }
  };

  return (
    <div className="athlete-predictions">
      <div className="prediction-controls">
        <h3>Prédictions par Athlète</h3>
        <div className="controls-row">
          <div className="control-group">
            <label>Nombre d'athlètes:</label>
            <select value={limit} onChange={(e) => setLimit(parseInt(e.target.value))}>
              <option value={25}>Top 25</option>
              <option value={50}>Top 50</option>
              <option value={100}>Top 100</option>
              <option value={200}>Top 200</option>
            </select>
          </div>
          <div className="control-group">
            <label>Modèle:</label>
            <select value={model} onChange={(e) => setModel(e.target.value)}>
              <option value="best">Meilleur Modèle</option>
              <option value="second">Deuxième Modèle</option>
            </select>
          </div>
          <button onClick={loadAthletes} disabled={loading}>
            {loading ? 'Chargement...' : 'Actualiser'}
          </button>
        </div>
        <div className="model-info">
          Modèle utilisé: {getModelName(model)}
        </div>
      </div>

      {error && (
        <div className="error-message">
          ❌ Erreur: {error}
        </div>
      )}

      {loading && (
        <div className="loading-message">
          🔄 Chargement des prédictions d'athlètes...
        </div>
      )}

      {!loading && athletes.length > 0 && (
        <div className="athletes-results">
          <h4>Performance Prédite des Athlètes</h4>
          <div className="athletes-list">
            {athletes.map((athlete, index) => {
              const scoreLevel = getScoreLevel(athlete.score);
              return (
                <div key={index} className="athlete-card">
                  <div className="athlete-rank">#{index + 1}</div>
                  
                  <div className="athlete-info">
                    <div className="athlete-name">{athlete.athlete}</div>
                    <div className="athlete-details">
                      <span className="athlete-country">
                        {getCountryFlag(athlete.country)} {athlete.country}
                      </span>
                      <span className="athlete-sport">
                        {getSportIcon(athlete.sport)} {athlete.sport}
                      </span>
                    </div>
                  </div>
                  
                  <div className="athlete-stats">
                    <div className="historical-medals">
                      <div className="medals-label">Médailles Historiques</div>
                      <div className="medals-count">{athlete.total}</div>
                    </div>
                    
                    <div className="prediction-score">
                      <div className="score-label">Score de Prédiction</div>
                      <div 
                        className="score-value"
                        style={{ color: scoreLevel.color }}
                      >
                        {(athlete.score * 100).toFixed(1)}%
                      </div>
                      <div 
                        className="score-level"
                        style={{ color: scoreLevel.color }}
                      >
                        {scoreLevel.level}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {!loading && athletes.length === 0 && !error && (
        <div className="no-data">
          <div className="no-data-icon">🏃‍♂️</div>
          <div className="no-data-text">
            Aucune donnée d'athlète disponible
          </div>
        </div>
      )}
    </div>
  );
};

export default AthletePredictions;
