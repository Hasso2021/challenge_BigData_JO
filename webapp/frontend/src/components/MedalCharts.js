import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

// Enregistrer les composants Chart.js nécessaires
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const MedalCharts = ({ franceMedals }) => {
  if (!franceMedals?.data) {
    return <div className="no-data">Aucune donnée disponible pour les graphiques</div>;
  }

  const { gold_medals, silver_medals, bronze_medals, total_medals } = franceMedals.data;

  // Configuration du graphique en barres
  const barData = {
    labels: ['Or', 'Argent', 'Bronze'],
    datasets: [
      {
        label: 'Nombre de médailles',
        data: [gold_medals, silver_medals, bronze_medals],
        backgroundColor: [
          'rgba(255, 193, 7, 0.8)',   // Or
          'rgba(192, 192, 192, 0.8)', // Argent
          'rgba(205, 127, 50, 0.8)',   // Bronze
        ],
        borderColor: [
          'rgba(255, 193, 7, 1)',
          'rgba(192, 192, 192, 1)',
          'rgba(205, 127, 50, 1)',
        ],
        borderWidth: 2,
      },
    ],
  };

  // Configuration du graphique en donut
  const doughnutData = {
    labels: ['Or', 'Argent', 'Bronze'],
    datasets: [
      {
        data: [gold_medals, silver_medals, bronze_medals],
        backgroundColor: [
          'rgba(255, 193, 7, 0.8)',
          'rgba(192, 192, 192, 0.8)',
          'rgba(205, 127, 50, 0.8)',
        ],
        borderColor: [
          'rgba(255, 193, 7, 1)',
          'rgba(192, 192, 192, 1)',
          'rgba(205, 127, 50, 1)',
        ],
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            size: 14,
            weight: 'bold',
          },
          color: '#1a1a1a',
        },
      },
      title: {
        display: true,
        text: 'Médailles de la France aux Jeux Olympiques',
        font: {
          size: 16,
          weight: 'bold',
        },
        color: '#1a1a1a',
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
            const value = context.parsed.y || context.parsed;
            const percentage = ((value / total_medals) * 100).toFixed(1);
            return `${label}: ${value} médailles (${percentage}%)`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: '#6c757d',
          font: {
            size: 12,
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
            size: 12,
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
            size: 14,
            weight: 'bold',
          },
          color: '#1a1a1a',
          padding: 20,
        },
      },
      title: {
        display: true,
        text: 'Répartition des médailles françaises',
        font: {
          size: 16,
          weight: 'bold',
        },
        color: '#1a1a1a',
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
            const percentage = ((value / total_medals) * 100).toFixed(1);
            return `${label}: ${value} médailles (${percentage}%)`;
          },
        },
      },
    },
  };

  return (
    <div className="medal-charts-container">
      <div className="charts-grid">
        <div className="chart-card">
          <div className="chart-header">
            <h4>📊 Graphique en barres</h4>
            <p>Comparaison des médailles par type</p>
          </div>
          <div className="chart-wrapper">
            <Bar data={barData} options={options} />
          </div>
        </div>
        
        <div className="chart-card">
          <div className="chart-header">
            <h4>🍩 Graphique en donut</h4>
            <p>Répartition proportionnelle des médailles</p>
          </div>
          <div className="chart-wrapper">
            <Doughnut data={doughnutData} options={doughnutOptions} />
          </div>
        </div>
      </div>
      
      <div className="charts-summary">
        <div className="summary-card">
          <h4>📈 Statistiques détaillées</h4>
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-label">Total des médailles:</span>
              <span className="stat-value">{total_medals}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Moyenne par type:</span>
              <span className="stat-value">{(total_medals / 3).toFixed(1)}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Meilleur type:</span>
              <span className="stat-value">
                {gold_medals > silver_medals && gold_medals > bronze_medals ? 'Or' :
                 silver_medals > bronze_medals ? 'Argent' : 'Bronze'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedalCharts;
