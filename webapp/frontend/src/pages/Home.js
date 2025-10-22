import React from 'react';
import OlympicRings from '../components/OlympicRings';
import './Home.css';

const Home = () => {
  return (
    <div className="home-container">
      <div className="hero-section">
        <OlympicRings />
        <h1 className="hero-title">OLYMPICS</h1>
        <p className="hero-subtitle">
          Explorez les données, visualisations et analyses des Jeux Olympiques
        </p>
        <div className="hero-actions">
          <a href="/olympic-facts" className="btn btn-primary">
            Découvrir les Faits Olympiques
          </a>
          <a href="/data" className="btn btn-secondary">
            Explorer les Données
          </a>
        </div>
      </div>
      
      <div className="features-section">
        <div className="container">
          <h2 className="section-title">Fonctionnalités</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>Données Olympiques</h3>
              <p>Accédez à des données complètes sur les athlètes, médailles et résultats olympiques</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📈</div>
              <h3>Visualisations</h3>
              <p>Explorez des graphiques interactifs et des analyses visuelles des performances</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔍</div>
              <h3>Analyse Avancée</h3>
              <p>Découvrez des insights et des tendances dans l'histoire olympique</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔮</div>
              <h3>Prédictions</h3>
              <p>Prédisez les performances futures basées sur les données historiques</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
