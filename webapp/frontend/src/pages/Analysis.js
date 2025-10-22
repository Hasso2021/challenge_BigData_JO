import React from 'react';
import './Analysis.css';

const Analysis = () => {
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
            <div className="analysis-card">
              <h3>Performance par Pays</h3>
              <p>Analyse comparative des performances nationales</p>
            </div>
            <div className="analysis-card">
              <h3>Tendances Temporelles</h3>
              <p>Évolution des performances au fil du temps</p>
            </div>
            <div className="analysis-card">
              <h3>Facteurs de Succès</h3>
              <p>Identification des facteurs clés de performance</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analysis;
