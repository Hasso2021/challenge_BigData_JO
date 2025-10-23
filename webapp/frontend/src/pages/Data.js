import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import DataViewer from '../components/DataViewer';
import OlympicRings from '../components/OlympicRings';
import '../styles/Data.css';

const Data = () => {
  const [selectedDataSource, setSelectedDataSource] = useState(null);

  const dataSources = [
    {
      id: 'athletes',
      title: 'Athlètes',
      description: 'Informations détaillées sur tous les athlètes olympiques',
      stats: ['+10,000 athlètes', '1896-2020'],
      icon: '🏃‍♂️'
    },
    {
      id: 'medals',
      title: 'Médailles',
      description: 'Historique complet des médailles et récompenses',
      stats: ['+50,000 médailles', 'Tous les sports'],
      icon: '🏅'
    },
    {
      id: 'results',
      title: 'Résultats',
      description: 'Résultats détaillés de toutes les compétitions',
      stats: ['+100,000 résultats', 'Été & Hiver'],
      icon: '📊'
    },
    {
      id: 'hosts',
      title: 'Villes Hôtes',
      description: 'Informations sur les villes et pays organisateurs',
      stats: ['23 pays hôtes', 'Depuis 1896'],
      icon: '🏛️'
    }
  ];

  const handleDataSourceClick = (dataSource) => {
    setSelectedDataSource(dataSource);
  };

  const handleCloseViewer = () => {
    setSelectedDataSource(null);
  };

  return (
    <div className="data-container">
      <div className="page-header">
        <div className="header-navigation">
          <Link to="/" className="home-nav-button">
            <span className="nav-icon">🏠</span>
            <span className="nav-text">Accueil</span>
          </Link>
          <div className="olympic-rings-nav">
            <OlympicRings />
          </div>
        </div>
        <h1 className="page-title">DONNÉES OLYMPIQUES</h1>
        <p className="page-subtitle">
          Explorez et analysez les données complètes des Jeux Olympiques
        </p>
      </div>
      
      <div className="data-content">
        <div className="data-section">
          <h2>Sources de Données</h2>
          <div className="data-cards">
            {dataSources.map((source) => (
              <div 
                key={source.id}
                className={`data-card ${selectedDataSource?.id === source.id ? 'active' : ''}`}
                onClick={() => handleDataSourceClick(source)}
              >
                <div className="data-card-icon">{source.icon}</div>
                <h3>{source.title}</h3>
                <p>{source.description}</p>
                <div className="data-stats">
                  {source.stats.map((stat, index) => (
                    <span key={index} className="stat">{stat}</span>
                  ))}
                </div>
                <div className="data-card-arrow">→</div>
              </div>
            ))}
          </div>
        </div>

        {selectedDataSource && (
          <DataViewer
            dataSource={selectedDataSource}
            onClose={handleCloseViewer}
          />
        )}
      </div>
    </div>
  );
};

export default Data;
