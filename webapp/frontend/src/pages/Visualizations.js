import React from 'react';
import './Visualizations.css';

const Visualizations = () => {
  return (
    <div className="visualizations-container">
      <div className="page-header">
        <h1 className="page-title">VISUALISATIONS</h1>
        <p className="page-subtitle">
          Explorez les données olympiques à travers des visualisations interactives
        </p>
      </div>
      
      <div className="visualizations-content">
        <div className="viz-grid">
          <div className="viz-card">
            <h3>Timeline des Médailles</h3>
            <p>Évolution des médailles par pays au fil du temps</p>
          </div>
          <div className="viz-card">
            <h3>Genre & Composition</h3>
            <p>Analyse de la participation par genre</p>
          </div>
          <div className="viz-card">
            <h3>Médailles VS PIB</h3>
            <p>Correlation entre performance et richesse nationale</p>
          </div>
          <div className="viz-card">
            <h3>Vue Monde - Saisons</h3>
            <p>Comparaison Jeux d'été vs d'hiver</p>
          </div>
          <div className="viz-card">
            <h3>Vue Monde - Sport</h3>
            <p>Répartition des médailles par sport</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Visualizations;
