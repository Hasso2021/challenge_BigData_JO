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
} from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';

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
  LineElement
);

const CountryPerformanceCharts = ({ countryData }) => {
  const [activeTab, setActiveTab] = useState('rankings');

  if (!countryData?.data) {
    return <div className="no-data">Aucune donnée disponible pour l'analyse des performances par pays</div>;
  }

  const { 
    country_rankings, 
    top_countries, 
    performance_evolution, 
    medal_distribution, 
    analysis 
  } = countryData.data;

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

  // Graphique 1: Top 15 pays par médailles
  const topCountriesData = {
    labels: top_countries.slice(0, 15).map(country => country.country),
    datasets: [
      {
        label: 'Médailles d\'Or',
        data: top_countries.slice(0, 15).map(country => country.gold),
        backgroundColor: colors.gold,
        borderColor: 'rgba(255, 193, 7, 1)',
        borderWidth: 2,
      },
      {
        label: 'Médailles d\'Argent',
        data: top_countries.slice(0, 15).map(country => country.silver),
        backgroundColor: colors.silver,
        borderColor: 'rgba(192, 192, 192, 1)',
        borderWidth: 2,
      },
      {
        label: 'Médailles de Bronze',
        data: top_countries.slice(0, 15).map(country => country.bronze),
        backgroundColor: colors.bronze,
        borderColor: 'rgba(205, 127, 50, 1)',
        borderWidth: 2,
      }
    ]
  };

  // Graphique 2: Distribution des médailles (Top 10)
  const distributionData = {
    labels: medal_distribution.slice(0, 10).map(item => item.country),
    datasets: [{
      data: medal_distribution.slice(0, 10).map(item => item.total_medals),
      backgroundColor: [
        colors.primary,
        colors.secondary,
        colors.success,
        colors.warning,
        colors.info,
        'rgba(108, 117, 125, 0.8)',
        'rgba(220, 53, 69, 0.8)',
        'rgba(102, 16, 242, 0.8)',
        'rgba(253, 126, 20, 0.8)',
        'rgba(32, 201, 151, 0.8)'
      ],
      borderColor: [
        'rgba(0, 129, 200, 1)',
        'rgba(255, 87, 51, 1)',
        'rgba(40, 167, 69, 1)',
        'rgba(255, 193, 7, 1)',
        'rgba(23, 162, 184, 1)',
        'rgba(108, 117, 125, 1)',
        'rgba(220, 53, 69, 1)',
        'rgba(102, 16, 242, 1)',
        'rgba(253, 126, 20, 1)',
        'rgba(32, 201, 151, 1)'
      ],
      borderWidth: 2,
    }]
  };

  // Graphique 3: Évolution des performances par décennies
  const evolutionData = {
    labels: performance_evolution.map(decade => `${decade.decade}s`),
    datasets: [
      {
        label: 'Total des médailles',
        data: performance_evolution.map(decade => decade.total_medals),
        borderColor: colors.primary,
        backgroundColor: colors.primary,
        tension: 0.4,
        fill: false,
      },
      {
        label: 'Nombre de pays participants',
        data: performance_evolution.map(decade => decade.total_countries),
        borderColor: colors.secondary,
        backgroundColor: colors.secondary,
        tension: 0.4,
        fill: false,
      }
    ]
  };

  // Graphique 4: Comparaison par type de médaille (Top 10)
  const medalTypeData = {
    labels: top_countries.slice(0, 10).map(country => country.country),
    datasets: [
      {
        label: 'Or',
        data: top_countries.slice(0, 10).map(country => country.gold),
        backgroundColor: colors.gold,
        borderColor: 'rgba(255, 193, 7, 1)',
        borderWidth: 2,
      },
      {
        label: 'Argent',
        data: top_countries.slice(0, 10).map(country => country.silver),
        backgroundColor: colors.silver,
        borderColor: 'rgba(192, 192, 192, 1)',
        borderWidth: 2,
      },
      {
        label: 'Bronze',
        data: top_countries.slice(0, 10).map(country => country.bronze),
        backgroundColor: colors.bronze,
        borderColor: 'rgba(205, 127, 50, 1)',
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
            const label = context.label || '';
            const value = context.parsed;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ${value} médailles (${percentage}%)`;
          },
        },
      },
    },
  };

  const lineOptions = {
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
            size: 11,
            weight: 'bold',
          },
        },
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <div className="country-performance-container">
      <div className="performance-header">
        <h2>🏆 Analyse Comparative des Performances Nationales</h2>
        <p>Découvrez les pays les plus performants aux Jeux Olympiques</p>
      </div>

      {/* Onglets de navigation */}
      <div className="performance-tabs">
        <button 
          className={`tab-button ${activeTab === 'rankings' ? 'active' : ''}`}
          onClick={() => setActiveTab('rankings')}
        >
          📊 Classements
        </button>
        <button 
          className={`tab-button ${activeTab === 'distribution' ? 'active' : ''}`}
          onClick={() => setActiveTab('distribution')}
        >
          🥇 Distribution
        </button>
        <button 
          className={`tab-button ${activeTab === 'evolution' ? 'active' : ''}`}
          onClick={() => setActiveTab('evolution')}
        >
          📈 Évolution
        </button>
        <button 
          className={`tab-button ${activeTab === 'comparison' ? 'active' : ''}`}
          onClick={() => setActiveTab('comparison')}
        >
          ⚖️ Comparaisons
        </button>
      </div>

      {/* Contenu des onglets */}
      <div className="performance-content">
        {activeTab === 'rankings' && (
          <div className="tab-content">
            <div className="charts-grid">
              <div className="chart-card">
                <div className="chart-header">
                  <h4>🥇 Top 15 Pays par Médailles</h4>
                  <p>Classement des pays les plus médaillés</p>
                </div>
                <div className="chart-wrapper">
                  <Bar data={topCountriesData} options={chartOptions} />
                </div>
              </div>
              
              <div className="chart-card">
                <div className="chart-header">
                  <h4>🏅 Répartition par Type de Médaille</h4>
                  <p>Comparaison des médailles d'or, d'argent et de bronze</p>
                </div>
                <div className="chart-wrapper">
                  <Bar data={medalTypeData} options={chartOptions} />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'distribution' && (
          <div className="tab-content">
            <div className="charts-grid">
              <div className="chart-card">
                <div className="chart-header">
                  <h4>🍩 Distribution des Médailles</h4>
                  <p>Part de marché des pays les plus performants</p>
                </div>
                <div className="chart-wrapper">
                  <Doughnut data={distributionData} options={doughnutOptions} />
                </div>
              </div>
              
              <div className="chart-card">
                <div className="chart-header">
                  <h4>📊 Statistiques Globales</h4>
                  <div className="stats-grid">
                    <div className="stat-item">
                      <span className="stat-label">Total des pays:</span>
                      <span className="stat-value">{analysis.total_countries}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Total des médailles:</span>
                      <span className="stat-value">{analysis.total_medals_global.toLocaleString()}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Médailles d'or:</span>
                      <span className="stat-value">{analysis.total_gold.toLocaleString()}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Moyenne par pays:</span>
                      <span className="stat-value">{analysis.average_medals_per_country.toFixed(1)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'evolution' && (
          <div className="tab-content">
            <div className="charts-grid">
              <div className="chart-card full-width">
                <div className="chart-header">
                  <h4>📈 Évolution des Performances par Décennies</h4>
                  <p>Croissance du nombre de médailles et de pays participants</p>
                </div>
                <div className="chart-wrapper">
                  <Line data={evolutionData} options={lineOptions} />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'comparison' && (
          <div className="tab-content">
            <div className="comparison-tables">
              <div className="table-card">
                <h4>🏆 Classement par Médailles Totales</h4>
                <div className="table-wrapper">
                  <table className="performance-table">
                    <thead>
                      <tr>
                        <th>Rang</th>
                        <th>Pays</th>
                        <th>Or</th>
                        <th>Argent</th>
                        <th>Bronze</th>
                        <th>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {country_rankings.by_medals.slice(0, 15).map((country, index) => (
                        <tr key={country.country}>
                          <td className="rank">{index + 1}</td>
                          <td className="country">{country.country}</td>
                          <td className="gold">{country.gold}</td>
                          <td className="silver">{country.silver}</td>
                          <td className="bronze">{country.bronze}</td>
                          <td className="total">{country.total}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CountryPerformanceCharts;
