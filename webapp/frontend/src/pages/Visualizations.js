import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
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
import OlympicRings from '../components/OlympicRings';
import { olympicDataService } from '../services/api';
import '../styles/Visualizations.css';

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
  const location = useLocation();
  
  // Determine which visualization to show based on the current route
  const getCurrentVisualization = () => {
    const path = location.pathname;
    if (path.includes('/timeline')) return 'medal-timeline';
    if (path.includes('/gender')) return 'genre-composition';
    if (path.includes('/gdp')) return 'medals-vs-gdp';
    if (path.includes('/world-seasons')) return 'world-seasons';
    if (path.includes('/world-sport')) return 'world-sports';
    return 'default';
  };

  const currentVisualization = getCurrentVisualization();

  // Load real GDP data when medals-vs-gdp visualization is selected
  useEffect(() => {
    console.log('🔍 Current visualization:', currentVisualization);
    console.log('🔍 Location pathname:', location.pathname);
    
    const fetchRealGDPData = async () => {
      if (currentVisualization === 'medals-vs-gdp') {
        try {
          console.log('🔄 Chargement des données PIB réelles...');
          console.log('📍 URL API:', process.env.REACT_APP_API_URL || 'http://localhost:5000/api');
          
          const response = await olympicDataService.getRealGDPMedalsData();
          console.log('📊 Réponse complète:', response);
          
          if (response.data && response.data.status === 'success') {
            console.log('✅ Données PIB chargées:', response.data.data);
            console.log('📈 Labels:', response.data.data.labels);
            console.log('💰 GDP Data:', response.data.data.gdp_data);
            console.log('🏅 Medals Data:', response.data.data.medals_data);
            
            setMedalsVsGdpData({
              labels: response.data.data.labels,
              datasets: [
                {
                  label: 'PIB (Milliards USD)',
                  data: response.data.data.gdp_data,
                  backgroundColor: 'rgba(75, 192, 192, 0.8)',
                  borderColor: 'rgba(75, 192, 192, 1)',
                  borderWidth: 2,
                  yAxisID: 'y',
                },
                {
                  label: 'Médailles Totales',
                  data: response.data.data.medals_data,
                  backgroundColor: 'rgba(255, 206, 86, 0.8)',
                  borderColor: 'rgba(255, 206, 86, 1)',
                  borderWidth: 2,
                  yAxisID: 'y1',
                }
              ]
            });
          } else {
            console.error('❌ Erreur dans la réponse API:', response.data);
            // Pas de fallback - afficher un message d'erreur
            console.log('❌ Impossible de charger les données depuis l\'API');
          }
        } catch (error) {
          console.error('❌ Erreur lors du chargement des données PIB réelles:', error);
          console.log('❌ Impossible de charger les données depuis l\'API');
        }
      }
    };

    fetchRealGDPData();
  }, [currentVisualization]);

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

  // Medals vs GDP Data - Dynamic state
  const [medalsVsGdpData, setMedalsVsGdpData] = useState({
    labels: [],
    datasets: [
      {
        label: 'PIB (Milliards USD)',
        data: [],
        backgroundColor: 'rgba(75, 192, 192, 0.8)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 2,
        yAxisID: 'y',
      },
      {
        label: 'Médailles Totales',
        data: [],
        backgroundColor: 'rgba(255, 206, 86, 0.8)',
        borderColor: 'rgba(255, 206, 86, 1)',
        borderWidth: 2,
        yAxisID: 'y1',
      }
    ]
  });

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
    switch (currentVisualization) {
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
        <div className="header-navigation">
          <Link to="/" className="home-nav-button">
            <span className="nav-icon">🏠</span>
            <span className="nav-text">Accueil</span>
          </Link>
          <div className="olympic-rings-nav">
            <OlympicRings />
          </div>
        </div>
        <h1 className="page-title">VISUALISATIONS</h1>
        <p className="page-subtitle">
          Explorez les données olympiques à travers des visualisations interactives
        </p>
      </div>
      
      <div className="visualizations-content">
        {/* Dynamic Content */}
        <div className="visualization-display">
          {renderSelectedVisualization()}
        </div>
      </div>
    </div>
  );
};

export default Visualizations;
