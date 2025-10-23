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
import { Bar, Doughnut, Pie } from 'react-chartjs-2';

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

const SportsCharts = ({ franceSports }) => {
  if (!franceSports?.data) {
    return <div className="no-data">Aucune donnée disponible pour les graphiques</div>;
  }

  const { top_sports, sport_specialties, analysis } = franceSports.data;

  // Configuration du graphique en barres pour le top 5
  const top5Data = {
    labels: top_sports.map(sport => sport.sport),
    datasets: [
      {
        label: 'Médailles d\'or',
        data: top_sports.map(sport => sport.gold),
        backgroundColor: 'rgba(255, 193, 7, 0.8)',
        borderColor: 'rgba(255, 193, 7, 1)',
        borderWidth: 2,
      },
      {
        label: 'Médailles d\'argent',
        data: top_sports.map(sport => sport.silver),
        backgroundColor: 'rgba(192, 192, 192, 0.8)',
        borderColor: 'rgba(192, 192, 192, 1)',
        borderWidth: 2,
      },
      {
        label: 'Médailles de bronze',
        data: top_sports.map(sport => sport.bronze),
        backgroundColor: 'rgba(205, 127, 50, 0.8)',
        borderColor: 'rgba(205, 127, 50, 1)',
        borderWidth: 2,
      },
    ],
  };

  // Configuration du graphique en donut pour les top 5
  const top5DoughnutData = {
    labels: top_sports.map(sport => sport.sport),
    datasets: [
      {
        data: top_sports.map(sport => sport.total),
        backgroundColor: [
          'rgba(255, 193, 7, 0.8)',
          'rgba(192, 192, 192, 0.8)',
          'rgba(205, 127, 50, 0.8)',
          'rgba(40, 167, 69, 0.8)',
          'rgba(0, 123, 255, 0.8)',
        ],
        borderColor: [
          'rgba(255, 193, 7, 1)',
          'rgba(192, 192, 192, 1)',
          'rgba(205, 127, 50, 1)',
          'rgba(40, 167, 69, 1)',
          'rgba(0, 123, 255, 1)',
        ],
        borderWidth: 2,
      },
    ],
  };

  // Configuration du graphique en camembert pour les sports dominants
  const dominantSports = franceSports.data.dominant_sports || [];
  const dominantData = {
    labels: dominantSports.map(sport => sport.sport),
    datasets: [
      {
        data: dominantSports.map(sport => sport.total),
        backgroundColor: [
          'rgba(255, 99, 132, 0.8)',
          'rgba(54, 162, 235, 0.8)',
          'rgba(255, 205, 86, 0.8)',
          'rgba(75, 192, 192, 0.8)',
          'rgba(153, 102, 255, 0.8)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 205, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
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
        text: 'Top 5 des spécialités sportives françaises',
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
            const label = context.dataset.label || '';
            const value = context.parsed.y || context.parsed;
            return `${label}: ${value} médailles`;
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
        text: 'Répartition des médailles par sport (Top 5)',
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
            const percentage = ((value / analysis.total_medals) * 100).toFixed(1);
            return `${label}: ${value} médailles (${percentage}%)`;
          },
        },
      },
    },
  };

  const pieOptions = {
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
        text: 'Sports dominants français',
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
            const percentage = ((value / analysis.total_medals) * 100).toFixed(1);
            return `${label}: ${value} médailles (${percentage}%)`;
          },
        },
      },
    },
  };

  return (
    <div className="sports-charts-container">
      <div className="charts-grid">
        <div className="chart-card">
          <div className="chart-header">
            <h4>📊 Graphique en barres</h4>
            <p>Comparaison des médailles par sport (Top 5)</p>
          </div>
          <div className="chart-wrapper">
            <Bar data={top5Data} options={options} />
          </div>
        </div>
        
        <div className="chart-card">
          <div className="chart-header">
            <h4>🍩 Graphique en donut</h4>
            <p>Répartition des médailles par sport</p>
          </div>
          <div className="chart-wrapper">
            <Doughnut data={top5DoughnutData} options={doughnutOptions} />
          </div>
        </div>
        
        {dominantSports.length > 0 && (
          <div className="chart-card">
            <div className="chart-header">
              <h4>🥧 Graphique en camembert</h4>
              <p>Sports dominants français</p>
            </div>
            <div className="chart-wrapper">
              <Pie data={dominantData} options={pieOptions} />
            </div>
          </div>
        )}
      </div>
      
      <div className="charts-summary">
        <div className="summary-card">
          <h4>📈 Statistiques des spécialités</h4>
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-label">Total des sports:</span>
              <span className="stat-value">{analysis.total_sports}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Moyenne par sport:</span>
              <span className="stat-value">{analysis.average_medals_per_sport.toFixed(1)}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Niveau de spécialisation:</span>
              <span className="stat-value">{(analysis.specialization_level * 100).toFixed(1)}%</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Sports dominants:</span>
              <span className="stat-value">{dominantSports.length}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SportsCharts;
