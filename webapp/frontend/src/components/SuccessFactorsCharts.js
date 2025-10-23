import React, { useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  ScatterController,
} from 'chart.js';
import { Bar, Doughnut, Line, Scatter } from 'react-chartjs-2';

// Enregistrer les composants Chart.js nécessaires
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  ScatterController
);

const SuccessFactorsCharts = ({ successData }) => {
  const [activeTab, setActiveTab] = useState('overview');

  if (!successData?.data) {
    return <div className="no-data">Aucune donnée disponible pour l'analyse des facteurs de succès</div>;
  }

  const { 
    sport_specialization, 
    host_advantage, 
    economic_factors, 
    historical_performance, 
    sport_diversity, 
    success_patterns, 
    analysis 
  } = successData.data;

  // Configuration des couleurs
  const colors = {
    gold: 'rgba(255, 193, 7, 0.8)',
    silver: 'rgba(192, 192, 192, 0.8)',
    bronze: 'rgba(205, 127, 50, 0.8)',
    primary: 'rgba(0, 129, 200, 0.8)',
    secondary: 'rgba(255, 87, 51, 0.8)',
    success: 'rgba(40, 167, 69, 0.8)',
    warning: 'rgba(255, 193, 7, 0.8)',
    info: 'rgba(23, 162, 184, 0.8)'
  };

  // Graphique 1: Spécialisation sportive
  const specializationData = {
    labels: sport_specialization.slice(0, 15).map(item => item.country),
    datasets: [
      {
        label: 'Ratio de Spécialisation',
        data: sport_specialization.slice(0, 15).map(item => item.sport_ratio),
        backgroundColor: colors.primary,
        borderColor: 'rgba(0, 129, 200, 1)',
        borderWidth: 2,
      }
    ]
  };

  // Graphique 2: Diversité sportive
  const diversityData = {
    labels: sport_diversity.slice(0, 15).map(item => item.country),
    datasets: [
      {
        label: 'Index de Diversité',
        data: sport_diversity.slice(0, 15).map(item => item.diversity_index),
        backgroundColor: colors.success,
        borderColor: 'rgba(40, 167, 69, 1)',
        borderWidth: 2,
      }
    ]
  };

  // Graphique 3: Facteurs économiques
  const economicData = {
    labels: economic_factors.slice(0, 15).map(item => item.country),
    datasets: [
      {
        label: 'Score Économique',
        data: economic_factors.slice(0, 15).map(item => item.economic_score),
        backgroundColor: colors.warning,
        borderColor: 'rgba(255, 193, 7, 1)',
        borderWidth: 2,
      }
    ]
  };

  // Graphique 4: Consistance historique
  const consistencyData = {
    labels: historical_performance.slice(0, 15).map(item => item.country),
    datasets: [
      {
        label: 'Score de Consistance',
        data: historical_performance.slice(0, 15).map(item => item.consistency_score),
        backgroundColor: colors.info,
        borderColor: 'rgba(23, 162, 184, 1)',
        borderWidth: 2,
      }
    ]
  };

  // Graphique 5: Scatter plot - Spécialisation vs Performance
  const scatterData = {
    datasets: [
      {
        label: 'Spécialisation vs Performance',
        data: sport_specialization.slice(0, 20).map(item => ({
          x: item.sport_ratio,
          y: item.total_medals
        })),
        backgroundColor: colors.primary,
        borderColor: 'rgba(0, 129, 200, 1)',
        borderWidth: 2,
        pointRadius: 6,
      }
    ]
  };

  // Graphique 6: Patterns de succès
  const patternsData = {
    labels: success_patterns.map(pattern => pattern.pattern),
    datasets: [{
      data: success_patterns.map(pattern => pattern.success_rate * 100),
      backgroundColor: [
        colors.primary,
        colors.secondary,
        colors.success,
        colors.warning,
        colors.info
      ],
      borderColor: [
        'rgba(0, 129, 200, 1)',
        'rgba(255, 87, 51, 1)',
        'rgba(40, 167, 69, 1)',
        'rgba(255, 193, 7, 1)',
        'rgba(23, 162, 184, 1)'
      ],
      borderWidth: 2,
    }]
  };

  // Graphique 7: Avantage du pays hôte
  const hostAdvantageData = {
    labels: host_advantage.slice(0, 20).map(item => `${item.country} (${item.year})`),
    datasets: [
      {
        label: 'Médailles (Pays Hôte Potentiel)',
        data: host_advantage.slice(0, 20).map(item => item.medals),
        backgroundColor: colors.secondary,
        borderColor: 'rgba(255, 87, 51, 1)',
        borderWidth: 2,
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            size: 12,
            weight: 'bold',
          },
          color: '#1a1a1a',
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: '#ffffff',
        borderWidth: 1,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: '#6c757d',
          font: {
            size: 11,
          },
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
      },
      x: {
        ticks: {
          color: '#6c757d',
          font: {
            size: 10,
            weight: 'bold',
          },
        },
        grid: {
          display: false,
        },
      },
    },
  };

  const scatterOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            size: 12,
            weight: 'bold',
          },
          color: '#1a1a1a',
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: '#ffffff',
        borderWidth: 1,
        callbacks: {
          label: function(context) {
            const item = sport_specialization[context.dataIndex];
            return [
              `Pays: ${item.country}`,
              `Spécialisation: ${(item.sport_ratio * 100).toFixed(1)}%`,
              `Médailles: ${item.total_medals}`,
              `Sport dominant: ${item.dominant_sport}`
            ];
          },
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Ratio de Spécialisation',
          font: {
            size: 12,
            weight: 'bold',
          },
          color: '#1a1a1a',
        },
        ticks: {
          color: '#6c757d',
          font: {
            size: 11,
          },
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Total des Médailles',
          font: {
            size: 12,
            weight: 'bold',
          },
          color: '#1a1a1a',
        },
        ticks: {
          color: '#6c757d',
          font: {
            size: 11,
          },
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          font: {
            size: 12,
            weight: 'bold',
          },
          color: '#1a1a1a',
          padding: 15,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: '#ffffff',
        borderWidth: 1,
        callbacks: {
          label: function(context) {
            const pattern = success_patterns[context.dataIndex];
            return `${pattern.pattern}: ${pattern.success_rate.toFixed(1)}% de succès`;
          },
        },
      },
    },
  };

  return (
    <div className="success-factors-container">
      <div className="factors-header">
        <h2>🔍 Analyse des Facteurs de Succès</h2>
        <p>Identification des facteurs clés de performance olympique</p>
      </div>

      {/* Onglets de navigation */}
      <div className="factors-tabs">
        <button 
          className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          📊 Vue d'ensemble
        </button>
        <button 
          className={`tab-button ${activeTab === 'specialization' ? 'active' : ''}`}
          onClick={() => setActiveTab('specialization')}
        >
          🎯 Spécialisation
        </button>
        <button 
          className={`tab-button ${activeTab === 'diversity' ? 'active' : ''}`}
          onClick={() => setActiveTab('diversity')}
        >
          🌍 Diversité
        </button>
        <button 
          className={`tab-button ${activeTab === 'economic' ? 'active' : ''}`}
          onClick={() => setActiveTab('economic')}
        >
          💰 Économique
        </button>
        <button 
          className={`tab-button ${activeTab === 'patterns' ? 'active' : ''}`}
          onClick={() => setActiveTab('patterns')}
        >
          📈 Patterns
        </button>
      </div>

      {/* Contenu des onglets */}
      <div className="factors-content">
        {activeTab === 'overview' && (
          <div className="tab-content">
            <div className="charts-grid">
              <div className="chart-card full-width">
                <div className="chart-header">
                  <h4>📊 Spécialisation vs Performance</h4>
                  <p>Relation entre la spécialisation sportive et le succès global</p>
                </div>
                <div className="chart-wrapper">
                  <Scatter data={scatterData} options={scatterOptions} />
                </div>
              </div>
              
              <div className="chart-card">
                <div className="chart-header">
                  <h4>📈 Patterns de Succès</h4>
                  <p>Taux de succès par type de stratégie</p>
                </div>
                <div className="chart-wrapper">
                  <Doughnut data={patternsData} options={doughnutOptions} />
                </div>
              </div>
              
              <div className="chart-card">
                <div className="chart-header">
                  <h4>🏆 Statistiques Globales</h4>
                  <div className="stats-grid">
                    <div className="stat-item">
                      <span className="stat-label">Total des pays:</span>
                      <span className="stat-value">{analysis.total_countries}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Total des médailles:</span>
                      <span className="stat-value">{analysis.total_medals.toLocaleString()}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Moyenne par pays:</span>
                      <span className="stat-value">{analysis.avg_medals_per_country}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Plus spécialisé:</span>
                      <span className="stat-value">{analysis.most_specialized?.country}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Plus diversifié:</span>
                      <span className="stat-value">{analysis.most_diverse?.country}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Plus consistant:</span>
                      <span className="stat-value">{analysis.most_consistent?.country}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'specialization' && (
          <div className="tab-content">
            <div className="charts-grid">
              <div className="chart-card full-width">
                <div className="chart-header">
                  <h4>🎯 Spécialisation Sportive</h4>
                  <p>Pays les plus spécialisés dans un sport dominant</p>
                </div>
                <div className="chart-wrapper">
                  <Bar data={specializationData} options={chartOptions} />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'diversity' && (
          <div className="tab-content">
            <div className="charts-grid">
              <div className="chart-card full-width">
                <div className="chart-header">
                  <h4>🌍 Diversité Sportive</h4>
                  <p>Pays participant à de nombreux sports</p>
                </div>
                <div className="chart-wrapper">
                  <Bar data={diversityData} options={chartOptions} />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'economic' && (
          <div className="tab-content">
            <div className="charts-grid">
              <div className="chart-card">
                <div className="chart-header">
                  <h4>💰 Facteurs Économiques</h4>
                  <p>Impact économique sur les performances</p>
                </div>
                <div className="chart-wrapper">
                  <Bar data={economicData} options={chartOptions} />
                </div>
              </div>
              
              <div className="chart-card">
                <div className="chart-header">
                  <h4>🏠 Avantage du Pays Hôte</h4>
                  <p>Performance des pays hôtes potentiels</p>
                </div>
                <div className="chart-wrapper">
                  <Bar data={hostAdvantageData} options={chartOptions} />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'patterns' && (
          <div className="tab-content">
            <div className="patterns-analysis">
              <div className="patterns-grid">
                {success_patterns.map((pattern, index) => (
                  <div key={index} className="pattern-card">
                    <h4>{pattern.pattern}</h4>
                    <p className="pattern-description">{pattern.description}</p>
                    <div className="pattern-stats">
                      <div className="stat-item">
                        <span className="stat-label">Taux de succès:</span>
                        <span className="stat-value">{(pattern.success_rate * 100).toFixed(1)}%</span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-label">Pays concernés:</span>
                        <span className="stat-value">{pattern.countries.length}</span>
                      </div>
                    </div>
                    <div className="pattern-countries">
                      <h5>Pays représentatifs:</h5>
                      <div className="countries-list">
                        {pattern.countries.slice(0, 5).map((country, idx) => (
                          <span key={idx} className="country-tag">
                            {country.country} ({country.total_medals} médailles)
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SuccessFactorsCharts;
