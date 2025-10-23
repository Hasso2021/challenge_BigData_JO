import React, { useState, useEffect } from 'react';
import CountryPredictions from '../components/CountryPredictions';
import SportPredictions from '../components/SportPredictions';
import AthletePredictions from '../components/AthletePredictions';
import { olympicDataService } from '../services/api';
import '../styles/Predictions.css';

const Predictions = () => {
  const [activeTab, setActiveTab] = useState('country');
  const [modelsStatus, setModelsStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadModelsStatus();
  }, []);

  const loadModelsStatus = async () => {
    setLoading(true);
    try {
      const response = await olympicDataService.getModelsStatus();
      setModelsStatus(response.data.data);
    } catch (err) {
      console.error('Erreur lors du chargement du statut des modèles:', err);
    } finally {
      setLoading(false);
    }
  };

  const getModelStatusIcon = (modelName) => {
    if (!modelsStatus) return '❓';
    const model = modelsStatus[modelName];
    return model && model.exists ? '✅' : '❌';
  };

  const getModelStatusText = (modelName) => {
    if (!modelsStatus) return 'Statut inconnu';
    const model = modelsStatus[modelName];
    if (model && model.exists) {
      const sizeKB = Math.round(model.size / 1024);
      return `Disponible (${sizeKB} KB)`;
    }
    return 'Non disponible';
  };

  return (
    <div className="predictions-container">
      <div className="page-header">
        <h1 className="page-title">PRÉDICTIONS DE MÉDAILLES OLYMPIQUES</h1>
        <p className="page-subtitle">
          Prédictions basées sur l'analyse des données historiques et modèles d'IA
        </p>
      </div>
      
      <div className="models-status">
        <h3>Statut des Modèles Entraînés</h3>
        <div className="models-grid">
          <div className="model-status">
            <span className="model-icon">{getModelStatusIcon('country_best.joblib')}</span>
            <div className="model-info">
              <div className="model-name">Modèle Pays (Meilleur)</div>
              <div className="model-desc">{getModelStatusText('country_best.joblib')}</div>
            </div>
          </div>
          <div className="model-status">
            <span className="model-icon">{getModelStatusIcon('country_second.joblib')}</span>
            <div className="model-info">
              <div className="model-name">Modèle Pays (Second)</div>
              <div className="model-desc">{getModelStatusText('country_second.joblib')}</div>
            </div>
          </div>
          <div className="model-status">
            <span className="model-icon">{getModelStatusIcon('top25_best.joblib')}</span>
            <div className="model-info">
              <div className="model-name">Modèle Top 25 (Meilleur)</div>
              <div className="model-desc">{getModelStatusText('top25_best.joblib')}</div>
            </div>
          </div>
          <div className="model-status">
            <span className="model-icon">{getModelStatusIcon('athletes_quick.joblib')}</span>
            <div className="model-info">
              <div className="model-name">Modèle Athlètes (Rapide)</div>
              <div className="model-desc">{getModelStatusText('athletes_quick.joblib')}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="predictions-tabs">
        <div className="tab-buttons">
          <button 
            className={`tab-button ${activeTab === 'country' ? 'active' : ''}`}
            onClick={() => setActiveTab('country')}
          >
            🏆 Prédictions par Pays
          </button>
          <button 
            className={`tab-button ${activeTab === 'sport' ? 'active' : ''}`}
            onClick={() => setActiveTab('sport')}
          >
            🏃 Prédictions par Sport
          </button>
          <button 
            className={`tab-button ${activeTab === 'athlete' ? 'active' : ''}`}
            onClick={() => setActiveTab('athlete')}
          >
            🏃‍♂️ Prédictions par Athlète
          </button>
        </div>

        <div className="tab-content">
          {activeTab === 'country' && <CountryPredictions />}
          {activeTab === 'sport' && <SportPredictions />}
          {activeTab === 'athlete' && <AthletePredictions />}
        </div>
      </div>
    </div>
  );
};

export default Predictions;
