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

const TemporalTrendsCharts = ({ temporalData }) => {
  const [activeTab, setActiveTab] = useState('overview');

  if (!temporalData?.data) {
    return <div className="no-data">Aucune donnée disponible pour l'analyse des tendances temporelles</div>;
  }

  const { 
    yearly_medals, 
    decade_analysis, 
    country_evolution, 
    sport_evolution, 
    participation_trends, 
    analysis 
  } = temporalData.data;

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

  // Graphique 1: Évolution des médailles par année
  const yearlyMedalsData = {
    labels: yearly_medals.map(year => year.year),
    datasets: [
      {
        label: 'Médailles d\'Or',
        data: yearly_medals.map(year => year.gold),
        borderColor: colors.gold,
        backgroundColor: colors.gold,
        tension: 0.4,
        fill: false,
      },
      {
        label: 'Médailles d\'Argent',
        data: yearly_medals.map(year => year.silver),
        borderColor: colors.silver,
        backgroundColor: colors.silver,
        tension: 0.4,
        fill: false,
      },
      {
        label: 'Médailles de Bronze',
        data: yearly_medals.map(year => year.bronze),
        borderColor: colors.bronze,
        backgroundColor: colors.bronze,
        tension: 0.4,
        fill: false,
      },
      {
        label: 'Total des Médailles',
        data: yearly_medals.map(year => year.total),
        borderColor: colors.primary,
        backgroundColor: colors.primary,
        tension: 0.4,
        fill: false,
        borderWidth: 3,
      }
    ]
  };

  // Graphique 2: Participation par année
  const participationData = {
    labels: participation_trends.map(trend => trend.year),
    datasets: [
      {
        label: 'Nombre de Pays',
        data: participation_trends.map(trend => trend.countries),
        borderColor: colors.primary,
        backgroundColor: colors.primary,
        tension: 0.4,
        fill: false,
        yAxisID: 'y',
      },
      {
        label: 'Nombre de Sports',
        data: participation_trends.map(trend => trend.sports),
        borderColor: colors.secondary,
        backgroundColor: colors.secondary,
        tension: 0.4,
        fill: false,
        yAxisID: 'y1',
      }
    ]
  };

  // Graphique 3: Analyse par décennies
  const decadeData = {
    labels: decade_analysis.map(decade => `${decade.decade}s`),
    datasets: [
      {
        label: 'Médailles d\'Or',
        data: decade_analysis.map(decade => decade.gold),
        backgroundColor: colors.gold,
        borderColor: 'rgba(255, 193, 7, 1)',
        borderWidth: 2,
      },
      {
        label: 'Médailles d\'Argent',
        data: decade_analysis.map(decade => decade.silver),
        backgroundColor: colors.silver,
        borderColor: 'rgba(192, 192, 192, 1)',
        borderWidth: 2,
      },
      {
        label: 'Médailles de Bronze',
        data: decade_analysis.map(decade => decade.bronze),
        backgroundColor: colors.bronze,
        borderColor: 'rgba(205, 127, 50, 1)',
        borderWidth: 2,
      }
    ]
  };

  // Graphique 4: Évolution des pays (Top 5)
  const topCountriesEvolution = country_evolution.slice(0, 5);
  const countryEvolutionData = {
    labels: yearly_medals.map(year => year.year),
    datasets: topCountriesEvolution.map((country, index) => ({
      label: country.country,
      data: country.evolution.map(ev => ev.medals),
      borderColor: [colors.primary, colors.secondary, colors.success, colors.warning, colors.info][index],
      backgroundColor: [colors.primary, colors.secondary, colors.success, colors.warning, colors.info][index],
      tension: 0.4,
      fill: false,
    }))
  };

  // Graphique 5: Évolution des sports (Top 5)
  const topSportsEvolution = sport_evolution.slice(0, 5);
  const sportEvolutionData = {
    labels: yearly_medals.map(year => year.year),
    datasets: topSportsEvolution.map((sport, index) => ({
      label: sport.sport,
      data: sport.evolution.map(ev => ev.medals),
      borderColor: [colors.primary, colors.secondary, colors.success, colors.warning, colors.info][index],
      backgroundColor: [colors.primary, colors.secondary, colors.success, colors.warning, colors.info][index],
      tension: 0.4,
      fill: false,
    }))
  };

  // Graphique 6: Distribution des médailles par décennie
  const decadeDistributionData = {
    labels: decade_analysis.map(decade => `${decade.decade}s`),
    datasets: [{
      data: decade_analysis.map(decade => decade.total),
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

  const participationOptions = {
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
        type: 'linear',
        display: true,
        position: 'left',
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
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        beginAtZero: true,
        ticks: {
          color: '#6c757d',
          font: {
            size: 11,
          },
        },
        grid: {
          drawOnChartArea: false,
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

  return (
    <div className="temporal-trends-container">
      <div className="trends-header">
        <h2>📈 Analyse des Tendances Temporelles</h2>
        <p>Évolution des performances olympiques au fil du temps</p>
      </div>

      {/* Onglets de navigation */}
      <div className="trends-tabs">
        <button 
          className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          📊 Vue d'ensemble
        </button>
        <button 
          className={`tab-button ${activeTab === 'participation' ? 'active' : ''}`}
          onClick={() => setActiveTab('participation')}
        >
          🌍 Participation
        </button>
        <button 
          className={`tab-button ${activeTab === 'countries' ? 'active' : ''}`}
          onClick={() => setActiveTab('countries')}
        >
          🏆 Pays
        </button>
        <button 
          className={`tab-button ${activeTab === 'sports' ? 'active' : ''}`}
          onClick={() => setActiveTab('sports')}
        >
          ⚽ Sports
        </button>
        <button 
          className={`tab-button ${activeTab === 'decades' ? 'active' : ''}`}
          onClick={() => setActiveTab('decades')}
        >
          📅 Décennies
        </button>
      </div>

      {/* Contenu des onglets */}
      <div className="trends-content">
        {activeTab === 'overview' && (
          <div className="tab-content">
            <div className="charts-grid">
              <div className="chart-card full-width">
                <div className="chart-header">
                  <h4>📈 Évolution des Médailles par Année</h4>
                  <p>Croissance des médailles olympiques au fil du temps</p>
                </div>
                <div className="chart-wrapper">
                  <Line data={yearlyMedalsData} options={lineOptions} />
                </div>
              </div>
              
              <div className="chart-card">
                <div className="chart-header">
                  <h4>📊 Statistiques Temporelles</h4>
                  <div className="stats-grid">
                    <div className="stat-item">
                      <span className="stat-label">Années analysées:</span>
                      <span className="stat-value">{analysis.total_years}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Total des médailles:</span>
                      <span className="stat-value">{analysis.total_medals_all_time.toLocaleString()}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Taux de croissance:</span>
                      <span className="stat-value">{analysis.growth_rate}%</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Moyenne par année:</span>
                      <span className="stat-value">{analysis.average_medals_per_year.toFixed(1)}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Meilleure année:</span>
                      <span className="stat-value">{analysis.best_year?.year} ({analysis.best_year?.total} médailles)</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Pire année:</span>
                      <span className="stat-value">{analysis.worst_year?.year} ({analysis.worst_year?.total} médailles)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'participation' && (
          <div className="tab-content">
            <div className="charts-grid">
              <div className="chart-card full-width">
                <div className="chart-header">
                  <h4>🌍 Évolution de la Participation</h4>
                  <p>Croissance du nombre de pays et de sports participants</p>
                </div>
                <div className="chart-wrapper">
                  <Line data={participationData} options={participationOptions} />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'countries' && (
          <div className="tab-content">
            <div className="charts-grid">
              <div className="chart-card full-width">
                <div className="chart-header">
                  <h4>🏆 Évolution des Top 5 Pays</h4>
                  <p>Performance des pays les plus médaillés au fil du temps</p>
                </div>
                <div className="chart-wrapper">
                  <Line data={countryEvolutionData} options={lineOptions} />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'sports' && (
          <div className="tab-content">
            <div className="charts-grid">
              <div className="chart-card full-width">
                <div className="chart-header">
                  <h4>⚽ Évolution des Top 5 Sports</h4>
                  <p>Performance des sports les plus médaillés au fil du temps</p>
                </div>
                <div className="chart-wrapper">
                  <Line data={sportEvolutionData} options={lineOptions} />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'decades' && (
          <div className="tab-content">
            <div className="charts-grid">
              <div className="chart-card">
                <div className="chart-header">
                  <h4>📊 Médailles par Décennie</h4>
                  <p>Répartition des médailles par type et par décennie</p>
                </div>
                <div className="chart-wrapper">
                  <Bar data={decadeData} options={chartOptions} />
                </div>
              </div>
              
              <div className="chart-card">
                <div className="chart-header">
                  <h4>🍩 Distribution par Décennie</h4>
                  <p>Part de chaque décennie dans le total des médailles</p>
                </div>
                <div className="chart-wrapper">
                  <Doughnut data={decadeDistributionData} options={doughnutOptions} />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TemporalTrendsCharts;
