import React, { useState, useEffect } from 'react';
import { olympicDataService } from '../services/api';
import '../styles/GDPMedalsAnalysis.css';

const GDPMedalsAnalysis = () => {
  const [correlationData, setCorrelationData] = useState(null);
  const [sportCostData, setSportCostData] = useState(null);
  const [gdpPerCapitaData, setGdpPerCapitaData] = useState(null);
  const [summaryData, setSummaryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchAnalysisData();
  }, []);

  const fetchAnalysisData = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('🔄 Chargement des données d\'analyse PIB-médailles...');

      const [summaryResponse, correlationResponse, sportCostResponse, gdpPerCapitaResponse] = await Promise.all([
        olympicDataService.getGDPAnalysisSummary(),
        olympicDataService.getGDPCorrelationByYear(),
        olympicDataService.getGDPCorrelationBySportCost(),
        olympicDataService.getGDPCorrelationPerCapita()
      ]);

      console.log('✅ Données d\'analyse chargées:', {
        summary: summaryResponse?.data,
        correlation: correlationResponse?.data,
        sportCost: sportCostResponse?.data,
        gdpPerCapita: gdpPerCapitaResponse?.data
      });

      setSummaryData(summaryResponse.data);
      setCorrelationData(correlationResponse.data);
      setSportCostData(sportCostResponse.data);
      setGdpPerCapitaData(gdpPerCapitaResponse.data);

    } catch (err) {
      console.error('❌ Erreur lors du chargement des données d\'analyse:', err);
      setError('Erreur lors du chargement des données d\'analyse');
    } finally {
      setLoading(false);
    }
  };

  const renderOverviewTab = () => {
    if (!summaryData) return <div>Chargement...</div>;

    return (
      <div className="gdp-analysis-overview">
        <div className="analysis-header">
          <h2>📊 Analyse de Corrélation PIB-Médailles Olympiques</h2>
          <p className="analysis-subtitle">
            Cette analyse examine la relation entre la puissance économique des pays et leurs performances aux Jeux Olympiques
          </p>
        </div>

        <div className="summary-cards">
          <div className="summary-card">
            <div className="card-icon">📈</div>
            <div className="card-content">
              <h3>Corrélation Moyenne</h3>
              <div className="correlation-value">
                {summaryData.mean_pearson_correlation?.toFixed(3)}
              </div>
              <div className="correlation-interpretation">
                {summaryData.correlation_interpretation} et {summaryData.correlation_direction}
              </div>
            </div>
          </div>

          <div className="summary-card">
            <div className="card-icon">📅</div>
            <div className="card-content">
              <h3>Période Analysée</h3>
              <div className="period-range">
                {summaryData.analysis_period || `${summaryData.years_analyzed?.[0]} - ${summaryData.years_analyzed?.[summaryData.years_analyzed.length - 1]}`}
              </div>
              <div className="years-count">
                {summaryData.years_analyzed?.length} années analysées
              </div>
              <div className="total-years">
                {summaryData.total_years_available} années disponibles
              </div>
            </div>
          </div>

          <div className="summary-card">
            <div className="card-icon">🏅</div>
            <div className="card-content">
              <h3>Sports Analysés</h3>
              <div className="sports-breakdown">
                {summaryData.sport_cost_analysis && Object.entries(summaryData.sport_cost_analysis).map(([level, data]) => (
                  <div key={level} className="sport-level">
                    <span className="level-name">{level.replace('_', ' ')}</span>
                    <span className="level-count">{data.sports_count} sports</span>
                  </div>
                ))}
              </div>
              <div className="total-sports">
                {summaryData.total_sports_available} sports disponibles
              </div>
            </div>
          </div>
        </div>

        <div className="key-insights">
          <h3>🔍 Principales Observations</h3>
          <ul>
            <li>
              <strong>Corrélation positive forte :</strong> Les pays avec un PIB élevé remportent généralement plus de médailles
            </li>
            <li>
              <strong>Sports à coût élevé :</strong> La corrélation est plus forte pour les sports nécessitant des infrastructures coûteuses
            </li>
            <li>
              <strong>PIB par habitant :</strong> Un indicateur plus précis que le PIB total pour certains pays
            </li>
            <li>
              <strong>Exceptions notables :</strong> Certains pays performent mieux que leur PIB ne le suggère
            </li>
            <li>
              <strong>Source de données :</strong> {summaryData.data_source || 'Base de données Supabase'}
            </li>
            <li>
              <strong>Note :</strong> Cette analyse utilise toutes les données disponibles avec des données PIB historiques
            </li>
          </ul>
        </div>
      </div>
    );
  };

  const renderCorrelationByYear = () => {
    if (!correlationData) return <div>Chargement...</div>;

    const years = Object.keys(correlationData).sort();
    const pearsonCorrelations = years.map(year => correlationData[year]?.pearson?.correlation || 0);
    const spearmanCorrelations = years.map(year => correlationData[year]?.spearman?.correlation || 0);

    return (
      <div className="correlation-by-year">
        <h3>📈 Évolution de la Corrélation dans le Temps</h3>
        
        <div className="correlation-chart">
          <div className="chart-container">
            <div className="chart-bars">
              {years.map((year, index) => (
                <div key={year} className="year-bar">
                  <div className="bar-group">
                    <div 
                      className="bar pearson-bar"
                      style={{ height: `${Math.abs(pearsonCorrelations[index]) * 100}%` }}
                      title={`Pearson: ${pearsonCorrelations[index]?.toFixed(3)}`}
                    >
                      <span className="bar-value">{pearsonCorrelations[index]?.toFixed(3)}</span>
                    </div>
                    <div 
                      className="bar spearman-bar"
                      style={{ height: `${Math.abs(spearmanCorrelations[index]) * 100}%` }}
                      title={`Spearman: ${spearmanCorrelations[index]?.toFixed(3)}`}
                    >
                      <span className="bar-value">{spearmanCorrelations[index]?.toFixed(3)}</span>
                    </div>
                  </div>
                  <div className="year-label">{year}</div>
                </div>
              ))}
            </div>
            <div className="chart-legend">
              <div className="legend-item">
                <div className="legend-color pearson-color"></div>
                <span>Corrélation de Pearson</span>
              </div>
              <div className="legend-item">
                <div className="legend-color spearman-color"></div>
                <span>Corrélation de Spearman</span>
              </div>
            </div>
          </div>
        </div>

        <div className="correlation-details">
          <h4>Détails par Année</h4>
          <div className="details-table">
            {years.map(year => {
              const data = correlationData[year];
              return (
                <div key={year} className="detail-row">
                  <div className="year-cell">{year}</div>
                  <div className="correlation-cell">
                    <span className="correlation-label">Pearson:</span>
                    <span className="correlation-value">{data?.pearson?.correlation?.toFixed(3)}</span>
                    <span className="p-value">(p={data?.pearson?.p_value?.toFixed(3)})</span>
                  </div>
                  <div className="correlation-cell">
                    <span className="correlation-label">Spearman:</span>
                    <span className="correlation-value">{data?.spearman?.correlation?.toFixed(3)}</span>
                    <span className="p-value">(p={data?.spearman?.p_value?.toFixed(3)})</span>
                  </div>
                  <div className="sample-cell">
                    <span className="sample-size">{data?.sample_size} pays</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const renderSportCostAnalysis = () => {
    if (!sportCostData) return <div>Chargement...</div>;

    const costLevels = Object.keys(sportCostData);
    const correlations = costLevels.map(level => sportCostData[level]?.pearson?.correlation || 0);

    return (
      <div className="sport-cost-analysis">
        <h3>🏅 Analyse par Coût des Sports</h3>
        
        <div className="cost-explanation">
          <p>
            Les sports sont classés selon leur coût d'infrastructure et d'entraînement :
          </p>
          <ul>
            <li><strong>Coût élevé :</strong> Sports nécessitant des équipements spécialisés (voile, équitation, cyclisme, etc.)</li>
            <li><strong>Coût moyen :</strong> Sports avec infrastructures standard (athlétisme, basketball, etc.)</li>
            <li><strong>Coût faible :</strong> Sports nécessitant peu d'infrastructure (marathon, marche, etc.)</li>
          </ul>
        </div>

        <div className="cost-chart">
          <div className="chart-bars">
            {costLevels.map((level, index) => {
              const data = sportCostData[level];
              const correlation = data?.pearson?.correlation || 0;
              const height = Math.abs(correlation) * 100;
              
              return (
                <div key={level} className="cost-bar">
                  <div 
                    className="bar"
                    style={{ height: `${height}%` }}
                    title={`Corrélation: ${correlation.toFixed(3)}`}
                  >
                    <span className="bar-value">{correlation.toFixed(3)}</span>
                  </div>
                  <div className="cost-label">
                    <div className="level-name">{level.replace('_', ' ')}</div>
                    <div className="level-stats">
                      {data?.sports_count} sports, {data?.medals_count} médailles
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="cost-details">
          <h4>Détails par Niveau de Coût</h4>
          <div className="cost-table">
            {costLevels.map(level => {
              const data = sportCostData[level];
              return (
                <div key={level} className="cost-row">
                  <div className="cost-level">{level.replace('_', ' ')}</div>
                  <div className="correlation-info">
                    <span>Pearson: {data?.pearson?.correlation?.toFixed(3)}</span>
                    <span>Spearman: {data?.spearman?.correlation?.toFixed(3)}</span>
                  </div>
                  <div className="stats-info">
                    <span>{data?.sports_count} sports</span>
                    <span>{data?.medals_count} médailles</span>
                    <span>{data?.sample_size} pays</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const renderGDPPerCapitaAnalysis = () => {
    if (!gdpPerCapitaData) return <div>Chargement...</div>;

    return (
      <div className="gdp-per-capita-analysis">
        <h3>👥 Analyse PIB par Habitant</h3>
        
        <div className="per-capita-explanation">
          <p>
            Le PIB par habitant offre une perspective différente en tenant compte de la taille de la population.
            Cela permet d'identifier les pays qui performent mieux que leur PIB total ne le suggère.
          </p>
        </div>

        <div className="per-capita-results">
          <div className="correlation-summary">
            <div className="correlation-card">
              <h4>Corrélation Pearson</h4>
              <div className="correlation-value">
                {gdpPerCapitaData.pearson?.correlation?.toFixed(3)}
              </div>
              <div className="p-value">
                p = {gdpPerCapitaData.pearson?.p_value?.toFixed(3)}
              </div>
            </div>
            
            <div className="correlation-card">
              <h4>Corrélation Spearman</h4>
              <div className="correlation-value">
                {gdpPerCapitaData.spearman?.correlation?.toFixed(3)}
              </div>
              <div className="p-value">
                p = {gdpPerCapitaData.spearman?.p_value?.toFixed(3)}
              </div>
            </div>
            
            <div className="sample-info">
              <h4>Échantillon</h4>
              <div className="sample-size">
                {gdpPerCapitaData.sample_size} pays analysés
              </div>
            </div>
          </div>
        </div>

        <div className="interpretation">
          <h4>Interprétation</h4>
          <p>
            {gdpPerCapitaData.pearson?.correlation > 0.5 ? 
              "Une corrélation positive forte suggère que le PIB par habitant est un bon prédicteur des performances olympiques." :
              gdpPerCapitaData.pearson?.correlation > 0.3 ?
              "Une corrélation positive modérée indique une relation significative entre PIB par habitant et médailles." :
              "Une corrélation faible suggère que d'autres facteurs que le PIB par habitant influencent davantage les performances."
            }
          </p>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="gdp-analysis-loading">
        <div className="loading-spinner"></div>
        <p>Chargement de l'analyse PIB-médailles...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="gdp-analysis-error">
        <div className="error-icon">❌</div>
        <h3>Erreur de chargement</h3>
        <p>{error}</p>
        <button onClick={fetchAnalysisData} className="retry-button">
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <div className="gdp-medals-analysis">
      <div className="analysis-tabs">
        <button 
          className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          📊 Vue d'ensemble
        </button>
        <button 
          className={`tab-button ${activeTab === 'correlation' ? 'active' : ''}`}
          onClick={() => setActiveTab('correlation')}
        >
          📈 Corrélation par Année
        </button>
        <button 
          className={`tab-button ${activeTab === 'sport-cost' ? 'active' : ''}`}
          onClick={() => setActiveTab('sport-cost')}
        >
          🏅 Coût des Sports
        </button>
        <button 
          className={`tab-button ${activeTab === 'per-capita' ? 'active' : ''}`}
          onClick={() => setActiveTab('per-capita')}
        >
          👥 PIB par Habitant
        </button>
      </div>

      <div className="analysis-content">
        {activeTab === 'overview' && renderOverviewTab()}
        {activeTab === 'correlation' && renderCorrelationByYear()}
        {activeTab === 'sport-cost' && renderSportCostAnalysis()}
        {activeTab === 'per-capita' && renderGDPPerCapitaAnalysis()}
      </div>
    </div>
  );
};

export default GDPMedalsAnalysis;
