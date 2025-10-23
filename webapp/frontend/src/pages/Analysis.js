import React, { useState, useEffect } from 'react';
import './Analysis.css';
import CountryPerformanceCharts from '../components/CountryPerformanceCharts';
import TemporalTrendsCharts from '../components/TemporalTrendsCharts';
import SuccessFactorsCharts from '../components/SuccessFactorsCharts';
import { olympicDataService } from '../services/api';

const Analysis = () => {
  const [activeAnalysis, setActiveAnalysis] = useState(null);
  const [countryData, setCountryData] = useState(null);
  const [temporalData, setTemporalData] = useState(null);
  const [successData, setSuccessData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAnalysisClick = async (analysisType) => {
    if (analysisType === 'country-performance') {
      setLoading(true);
      setError(null);
      try {
        const response = await olympicDataService.getCountryPerformance();
        setCountryData(response.data);
        setActiveAnalysis(analysisType);
      } catch (err) {
        console.error('Erreur lors du chargement des données:', err);
        setError('Erreur lors du chargement des données de performance par pays');
      } finally {
        setLoading(false);
      }
    } else if (analysisType === 'temporal-trends') {
      setLoading(true);
      setError(null);
      try {
        const response = await olympicDataService.getTemporalTrends();
        setTemporalData(response.data);
        setActiveAnalysis(analysisType);
      } catch (err) {
        console.error('Erreur lors du chargement des données:', err);
        setError('Erreur lors du chargement des données de tendances temporelles');
      } finally {
        setLoading(false);
      }
    } else if (analysisType === 'success-factors') {
      setLoading(true);
      setError(null);
      try {
        const response = await olympicDataService.getSuccessFactors();
        setSuccessData(response.data);
        setActiveAnalysis(analysisType);
      } catch (err) {
        console.error('Erreur lors du chargement des données:', err);
        setError('Erreur lors du chargement des données de facteurs de succès');
      } finally {
        setLoading(false);
      }
    } else {
      setActiveAnalysis(analysisType);
    }
  };

  const handleBackToMenu = () => {
    setActiveAnalysis(null);
    setCountryData(null);
    setTemporalData(null);
    setSuccessData(null);
    setError(null);
  };

  if (activeAnalysis === 'country-performance') {
    return (
      <div className="analysis-container">
        <div className="analysis-header">
          <button className="back-button" onClick={handleBackToMenu}>
            ← Retour aux analyses
          </button>
          <h1 className="page-title">Performance par Pays</h1>
          <p className="page-subtitle">
            Analyse comparative des performances nationales aux Jeux Olympiques
          </p>
        </div>
        
        <div className="analysis-content">
          {loading && (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Chargement des données...</p>
            </div>
          )}
          
          {error && (
            <div className="error-container">
              <p>❌ {error}</p>
              <button className="retry-button" onClick={() => handleAnalysisClick('country-performance')}>
                Réessayer
              </button>
            </div>
          )}
          
          {countryData && !loading && !error && (
            <CountryPerformanceCharts countryData={countryData} />
          )}
        </div>
      </div>
    );
  }

  if (activeAnalysis === 'temporal-trends') {
    return (
      <div className="analysis-container">
        <div className="analysis-header">
          <button className="back-button" onClick={handleBackToMenu}>
            ← Retour aux analyses
          </button>
          <h1 className="page-title">Tendances Temporelles</h1>
          <p className="page-subtitle">
            Évolution des performances olympiques au fil du temps
          </p>
        </div>
        
        <div className="analysis-content">
          {loading && (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Chargement des données...</p>
            </div>
          )}
          
          {error && (
            <div className="error-container">
              <p>❌ {error}</p>
              <button className="retry-button" onClick={() => handleAnalysisClick('temporal-trends')}>
                Réessayer
              </button>
            </div>
          )}
          
          {temporalData && !loading && !error && (
            <TemporalTrendsCharts temporalData={temporalData} />
          )}
        </div>
      </div>
    );
  }

  if (activeAnalysis === 'success-factors') {
    return (
      <div className="analysis-container">
        <div className="analysis-header">
          <button className="back-button" onClick={handleBackToMenu}>
            ← Retour aux analyses
          </button>
          <h1 className="page-title">Facteurs de Succès</h1>
          <p className="page-subtitle">
            Identification des facteurs clés de performance olympique
          </p>
        </div>
        
        <div className="analysis-content">
          {loading && (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Chargement des données...</p>
            </div>
          )}
          
          {error && (
            <div className="error-container">
              <p>❌ {error}</p>
              <button className="retry-button" onClick={() => handleAnalysisClick('success-factors')}>
                Réessayer
              </button>
            </div>
          )}
          
          {successData && !loading && !error && (
            <SuccessFactorsCharts successData={successData} />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="analysis-container">
      <div className="page-header">
        <h1 className="page-title">ANALYSE</h1>
        <p className="page-subtitle">
          Insights et analyses approfondies des données olympiques
        </p>
      </div>
      
      <div className="analysis-content">
        <div className="analysis-section">
          <h2>Analyses Disponibles</h2>
          <div className="analysis-cards">
            <div 
              className="analysis-card clickable" 
              onClick={() => handleAnalysisClick('country-performance')}
            >
              <h3>🏆 Performance par Pays</h3>
              <p>Analyse comparative des performances nationales</p>
              <div className="card-features">
                <span className="feature">• Classements globaux</span>
                <span className="feature">• Évolution temporelle</span>
                <span className="feature">• Distribution des médailles</span>
              </div>
            </div>
            <div 
              className="analysis-card clickable" 
              onClick={() => handleAnalysisClick('temporal-trends')}
            >
              <h3>📈 Tendances Temporelles</h3>
              <p>Évolution des performances au fil du temps</p>
              <div className="card-features">
                <span className="feature">• Évolution des médailles</span>
                <span className="feature">• Croissance de la participation</span>
                <span className="feature">• Analyse par décennies</span>
              </div>
            </div>
            <div 
              className="analysis-card clickable" 
              onClick={() => handleAnalysisClick('success-factors')}
            >
              <h3>🔍 Facteurs de Succès</h3>
              <p>Identification des facteurs clés de performance</p>
              <div className="card-features">
                <span className="feature">• Spécialisation sportive</span>
                <span className="feature">• Facteurs économiques</span>
                <span className="feature">• Patterns de succès</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analysis;
