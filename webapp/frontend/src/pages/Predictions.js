import React from 'react';
import './Predictions.css';

const Predictions = () => {
  return (
    <div className="predictions-container">
      <div className="page-header">
        <h1 className="page-title">PRÉDICTIONS DE MÉDAILLES OLYMPIQUES</h1>
        <p className="page-subtitle">
          Prédictions basées sur l'analyse des données historiques
        </p>
      </div>
      
      <div className="predictions-content">
        <div className="predictions-section">
          <h2>Modèles de Prédiction</h2>
          <div className="predictions-cards">
            <div className="prediction-card">
              <h3>Prédictions par Pays</h3>
              <p>Estimation des médailles par nation</p>
            </div>
            <div className="prediction-card">
              <h3>Prédictions par Sport</h3>
              <p>Performance attendue par discipline</p>
            </div>
            <div className="prediction-card">
              <h3>Prédictions par Athlète</h3>
              <p>Performance individuelle prédite</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Predictions;
