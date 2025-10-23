import React, { useState, useEffect } from 'react';
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
  RadialLinearScale,
} from 'chart.js';
import { Bar, Doughnut, Line, Pie, Radar } from 'react-chartjs-2';
import './Visualizations.css';

// Register Chart.js components
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
  RadialLinearScale
);

const Visualizations = () => {
  const [selectedVisualization, setSelectedVisualization] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const visualizationOptions = [
    { 
      value: 'medal-timeline', 
      label: 'Médaille Timeline',
      icon: '📈',
      description: 'Évolution des médailles par pays au fil du temps'
    },
    { 
      value: 'genre-composition', 
      label: 'Genre & Composition',
      icon: '👥',
      description: 'Analyse de la participation par genre'
    },
    { 
      value: 'medals-vs-gdp', 
      label: 'Médailles VS PIB',
      icon: '💰',
      description: 'Corrélation entre performance et richesse nationale'
    },
    { 
      value: 'world-seasons', 
      label: 'Vue Monde - Saisons',
      icon: '🌍',
      description: 'Comparaison Jeux d\'été vs d\'hiver'
    },
    { 
      value: 'world-sports', 
      label: 'Vue Monde - Sport',
      icon: '🏃‍♂️',
      description: 'Répartition des médailles par sport'
    }
  ];

  const handleVisualizationChange = (event) => {
    setIsLoading(true);
    setSelectedVisualization(event.target.value);
    
    // Simulate loading time for better UX
    setTimeout(() => {
      setIsLoading(false);
    }, 800);
  };

  // Medal Timeline Data
  const medalTimelineData = {
    labels: ['1896', '1900', '1920', '1936', '1952', '1960', '1972', '1984', '1996', '2008', '2016', '2021'],
    datasets: [
      {
        label: 'États-Unis',
        data: [11, 19, 95, 24, 76, 71, 94, 83, 101, 110, 121, 113],
        borderColor: 'rgba(0, 123, 255, 0.8)',
        backgroundColor: 'rgba(0, 123, 255, 0.2)',
        tension: 0.4,
        fill: false,
      },
      {
        label: 'URSS/Russie',
        data: [0, 0, 0, 0, 71, 103, 99, 55, 63, 72, 56, 71],
        borderColor: 'rgba(220, 53, 69, 0.8)',
        backgroundColor: 'rgba(220, 53, 69, 0.2)',
        tension: 0.4,
        fill: false,
      },
      {
        label: 'Allemagne',
        data: [6, 4, 0, 33, 0, 0, 0, 0, 65, 41, 42, 37],
        borderColor: 'rgba(40, 167, 69, 0.8)',
        backgroundColor: 'rgba(40, 167, 69, 0.2)',
        tension: 0.4,
        fill: false,
      },
      {
        label: 'France',
        data: [5, 26, 9, 7, 6, 0, 13, 20, 37, 40, 42, 33],
        borderColor: 'rgba(255, 193, 7, 0.8)',
        backgroundColor: 'rgba(255, 193, 7, 0.2)',
        tension: 0.4,
        fill: false,
      }
    ]
  };

  // Genre Composition Data
  const genreCompositionData = {
    labels: ['1896', '1900', '1920', '1936', '1952', '1960', '1972', '1984', '1996', '2008', '2016', '2021'],
    datasets: [
      {
        label: 'Hommes',
        data: [100, 100, 100, 100, 95, 90, 85, 80, 70, 65, 60, 55],
        backgroundColor: 'rgba(54, 162, 235, 0.8)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 2,
      },
      {
        label: 'Femmes',
        data: [0, 0, 0, 0, 5, 10, 15, 20, 30, 35, 40, 45],
        backgroundColor: 'rgba(255, 99, 132, 0.8)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 2,
      }
    ]
  };

  // Medals vs GDP Data
  const medalsVsGdpData = {
    labels: ['États-Unis', 'Chine', 'Japon', 'Allemagne', 'France', 'Royaume-Uni', 'Italie', 'Canada', 'Australie', 'Corée du Sud'],
    datasets: [
      {
        label: 'PIB (Milliards USD)',
        data: [21000, 14000, 5000, 3800, 2600, 2800, 2000, 1700, 1500, 1800],
        backgroundColor: 'rgba(75, 192, 192, 0.8)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 2,
        yAxisID: 'y',
      },
      {
        label: 'Médailles Totales',
        data: [113, 88, 58, 37, 33, 65, 40, 22, 46, 6],
        backgroundColor: 'rgba(255, 206, 86, 0.8)',
        borderColor: 'rgba(255, 206, 86, 1)',
        borderWidth: 2,
        yAxisID: 'y1',
      }
    ]
  };

  // World Seasons Data
  const worldSeasonsData = {
    labels: ['Été', 'Hiver'],
    datasets: [
      {
        data: [75, 25],
        backgroundColor: [
          'rgba(255, 99, 132, 0.8)',
          'rgba(54, 162, 235, 0.8)'
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)'
        ],
        borderWidth: 2,
      }
    ]
  };

  // World Sports Data
  const worldSportsData = {
    labels: ['Athlétisme', 'Natation', 'Gymnastique', 'Cyclisme', 'Aviron', 'Tir', 'Escrime', 'Boxe', 'Judo', 'Tennis'],
    datasets: [
      {
        label: 'Médailles',
        data: [120, 95, 80, 70, 65, 60, 55, 50, 45, 40],
        backgroundColor: [
          'rgba(255, 99, 132, 0.8)',
          'rgba(54, 162, 235, 0.8)',
          'rgba(255, 206, 86, 0.8)',
          'rgba(75, 192, 192, 0.8)',
          'rgba(153, 102, 255, 0.8)',
          'rgba(255, 159, 64, 0.8)',
          'rgba(199, 199, 199, 0.8)',
          'rgba(83, 102, 255, 0.8)',
          'rgba(255, 99, 255, 0.8)',
          'rgba(99, 255, 132, 0.8)'
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
          'rgba(199, 199, 199, 1)',
          'rgba(83, 102, 255, 1)',
          'rgba(255, 99, 255, 1)',
          'rgba(99, 255, 132, 1)'
        ],
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
          font: { size: 11 },
        },
        grid: { color: 'rgba(0, 0, 0, 0.1)' },
      },
      x: {
        ticks: {
          color: '#6c757d',
          font: { size: 11, weight: 'bold' },
        },
        grid: { display: false },
      },
    },
  };

  const renderSelectedVisualization = () => {
    if (isLoading) {
      return (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Chargement de la visualisation...</p>
        </div>
      );
    }

    switch (selectedVisualization) {
      case 'medal-timeline':
        return (
          <div className="visualization-content">
            <div className="chart-header">
              <h3>📈 Timeline des Médailles</h3>
              <p>Évolution des médailles des principales nations olympiques</p>
            </div>
            <div className="chart-container">
              <Line data={medalTimelineData} options={chartOptions} />
            </div>
            <div className="chart-insights">
              <div className="insight-card">
                <h4>💡 Insights</h4>
                <ul>
                  <li>Les États-Unis dominent historiquement</li>
                  <li>L'URSS a eu un impact majeur de 1952 à 1988</li>
                  <li>La France maintient une présence constante</li>
                </ul>
              </div>
            </div>
          </div>
        );

      case 'genre-composition':
        return (
          <div className="visualization-content">
            <div className="chart-header">
              <h3>👥 Genre & Composition</h3>
              <p>Évolution de la participation par genre aux Jeux Olympiques</p>
            </div>
            <div className="chart-container">
              <Bar data={genreCompositionData} options={chartOptions} />
            </div>
            <div className="chart-insights">
              <div className="insight-card">
                <h4>💡 Insights</h4>
                <ul>
                  <li>Progression constante de la participation féminine</li>
                  <li>Parité atteinte dans les années 2000</li>
                  <li>Évolution reflétant les changements sociétaux</li>
                </ul>
              </div>
            </div>
          </div>
        );

      case 'medals-vs-gdp':
        return (
          <div className="visualization-content">
            <div className="chart-header">
              <h3>💰 Médailles VS PIB</h3>
              <p>Corrélation entre richesse nationale et performance olympique</p>
            </div>
            <div className="chart-container">
              <Bar data={medalsVsGdpData} options={{
                ...chartOptions,
                scales: {
                  ...chartOptions.scales,
                  y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    beginAtZero: true,
                  },
                  y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    beginAtZero: true,
                    grid: { drawOnChartArea: false },
                  },
                },
              }} />
            </div>
            <div className="chart-insights">
              <div className="insight-card">
                <h4>💡 Insights</h4>
                <ul>
                  <li>Corrélation positive entre PIB et médailles</li>
                  <li>Certains pays surperforment (Cuba, Kenya)</li>
                  <li>L'investissement sportif influence les résultats</li>
                </ul>
              </div>
            </div>
          </div>
        );

      case 'world-seasons':
        return (
          <div className="visualization-content">
            <div className="chart-header">
              <h3>🌍 Vue Monde - Saisons</h3>
              <p>Répartition des médailles entre Jeux d'été et d'hiver</p>
            </div>
            <div className="chart-container">
              <Doughnut data={worldSeasonsData} options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'bottom',
                    labels: {
                      font: { size: 14, weight: 'bold' },
                      color: '#1a1a1a',
                      padding: 20,
                    },
                  },
                  tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: '#ffffff',
                    bodyColor: '#ffffff',
                  },
                },
              }} />
            </div>
            <div className="chart-insights">
              <div className="insight-card">
                <h4>💡 Insights</h4>
                <ul>
                  <li>Les Jeux d'été dominent (75% des médailles)</li>
                  <li>Plus de sports en été qu'en hiver</li>
                  <li>Participation mondiale plus large en été</li>
                </ul>
              </div>
            </div>
          </div>
        );

      case 'world-sports':
        return (
          <div className="visualization-content">
            <div className="chart-header">
              <h3>🏃‍♂️ Vue Monde - Sport</h3>
              <p>Répartition des médailles par discipline sportive</p>
            </div>
            <div className="chart-container">
              <Bar data={worldSportsData} options={chartOptions} />
            </div>
            <div className="chart-insights">
              <div className="insight-card">
                <h4>💡 Insights</h4>
                <ul>
                  <li>L'athlétisme domine avec 120 médailles</li>
                  <li>La natation est le 2ème sport le plus médaillé</li>
                  <li>Diversité des sports reflète l'évolution olympique</li>
                </ul>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="visualization-placeholder">
            <div className="placeholder-content">
              <h3>🎯 Choisissez une Visualisation</h3>
              <p>Sélectionnez une option dans le menu déroulant pour explorer les données olympiques</p>
              <div className="placeholder-features">
                <div className="feature-item">
                  <span className="feature-icon">📈</span>
                  <span>Timeline interactive</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">👥</span>
                  <span>Analyse par genre</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">💰</span>
                  <span>Corrélations économiques</span>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="visualizations-container">
      <div className="page-header">
        <h1 className="page-title">VISUALISATIONS</h1>
        <p className="page-subtitle">
          Explorez les données olympiques à travers des visualisations interactives
        </p>
      </div>
      
      <div className="visualizations-content">
        {/* Dropdown Selection */}
        <div className="visualization-selector">
          <div className="selector-header">
            <h3>🎨 Sélectionnez une Visualisation</h3>
            <p>Choisissez parmi nos analyses interactives</p>
          </div>
          <div className="dropdown-container">
            <select 
              value={selectedVisualization}
              onChange={handleVisualizationChange}
              className="visualization-dropdown"
            >
              <option value="">-- Choisir une visualisation --</option>
              {visualizationOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.icon} {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Dynamic Content */}
        <div className="visualization-display">
          {renderSelectedVisualization()}
        </div>
      </div>
    </div>
  );
};

export default Visualizations;
