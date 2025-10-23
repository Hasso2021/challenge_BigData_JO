import React, { useState, useEffect } from 'react';
import OlympicRings from '../components/OlympicRings';
import '../styles/Home.css';

const Home = () => {
  const [stats, setStats] = useState({
    totalAthletes: 0,
    totalMedals: 0,
    totalCountries: 0,
    totalGames: 0
  });

  useEffect(() => {
    // Simuler le chargement des statistiques
    const loadStats = async () => {
      try {
        // Ici vous pourriez faire des appels API pour récupérer les vraies statistiques
        setStats({
          totalAthletes: 15000,
          totalMedals: 50000,
          totalCountries: 200,
          totalGames: 50
        });
      } catch (error) {
        console.error('Erreur lors du chargement des statistiques:', error);
      }
    };

    loadStats();
  }, []);

  return (
    <div className="home-container">
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-background">
          <div className="olympic-rings-container">
            <OlympicRings />
          </div>
        </div>
        
        <div className="hero-content">
          <h1 className="hero-title">
            <span className="title-line">OLYMPICS</span>
            <span className="title-line">DATA</span>
            <span className="title-line">HUB</span>
          </h1>
          <p className="hero-subtitle">
            Explorez l'univers des Jeux Olympiques à travers des données riches, 
            des visualisations interactives et des analyses prédictives avancées
          </p>
          
          <div className="hero-stats">
            <div className="stat-item">
              <div className="stat-number">{stats.totalAthletes.toLocaleString()}</div>
              <div className="stat-label">Athlètes</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">{stats.totalMedals.toLocaleString()}</div>
              <div className="stat-label">Médailles</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">{stats.totalCountries}</div>
              <div className="stat-label">Pays</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">{stats.totalGames}</div>
              <div className="stat-label">Éditions</div>
            </div>
          </div>

          <div className="hero-actions">
            <a href="/olympic-facts" className="btn btn-primary">
              <span className="btn-icon">🏆</span>
              Découvrir les Faits Olympiques
            </a>
            <a href="/data" className="btn btn-secondary">
              <span className="btn-icon">📊</span>
              Explorer les Données
            </a>
            <a href="/visualizations" className="btn btn-outline">
              <span className="btn-icon">📈</span>
              Visualisations
            </a>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="features-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Fonctionnalités Principales</h2>
            <p className="section-subtitle">
              Une plateforme complète pour l'analyse des données olympiques
            </p>
          </div>
          
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>Base de Données Complète</h3>
              <p>Accédez à plus de 50 000 médailles, 15 000 athlètes et 200 pays participants depuis 1896</p>
              <div className="feature-highlight">
                <span className="highlight-number">50K+</span>
                <span className="highlight-text">Médailles</span>
              </div>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">📈</div>
              <h3>Visualisations Interactives</h3>
              <p>Explorez des graphiques dynamiques, cartes thermiques et analyses temporelles</p>
              <div className="feature-highlight">
                <span className="highlight-number">15+</span>
                <span className="highlight-text">Types de Graphiques</span>
              </div>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">🔍</div>
              <h3>Analyse Prédictive</h3>
              <p>Découvrez des tendances et prédisez les performances futures avec l'IA</p>
              <div className="feature-highlight">
                <span className="highlight-number">ML</span>
                <span className="highlight-text">Algorithmes</span>
              </div>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">🏅</div>
              <h3>Comparaisons Pays</h3>
              <p>Analysez les performances par pays, sport et période historique</p>
              <div className="feature-highlight">
                <span className="highlight-number">200+</span>
                <span className="highlight-text">Pays</span>
              </div>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <h3>Temps Réel</h3>
              <p>Données mises à jour en temps réel avec des filtres avancés</p>
              <div className="feature-highlight">
                <span className="highlight-number">Live</span>
                <span className="highlight-text">Données</span>
              </div>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">📱</div>
              <h3>Interface Moderne</h3>
              <p>Design responsive et intuitif pour une expérience utilisateur optimale</p>
              <div className="feature-highlight">
                <span className="highlight-number">100%</span>
                <span className="highlight-text">Responsive</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Access Section */}
      <div className="quick-access-section">
        <div className="container">
          <h2 className="section-title">Accès Rapide</h2>
          <div className="quick-access-grid">
            <a href="/data" className="quick-access-card">
              <div className="card-icon">🏃‍♂️</div>
              <h3>Athlètes</h3>
              <p>Explorez les profils et performances des athlètes</p>
            </a>
            <a href="/data" className="quick-access-card">
              <div className="card-icon">🏅</div>
              <h3>Médailles</h3>
              <p>Analysez les récompenses et classements</p>
            </a>
            <a href="/data" className="quick-access-card">
              <div className="card-icon">🏛️</div>
              <h3>Villes Hôtes</h3>
              <p>Découvrez l'histoire des Jeux Olympiques</p>
            </a>
            <a href="/visualizations" className="quick-access-card">
              <div className="card-icon">📊</div>
              <h3>Graphiques</h3>
              <p>Visualisez les données de manière interactive</p>
            </a>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Prêt à Explorer les Données Olympiques ?</h2>
            <p>Commencez votre voyage dans l'univers des Jeux Olympiques</p>
            <div className="cta-actions">
              <a href="/data" className="btn btn-primary btn-large">
                Commencer l'Exploration
              </a>
              <a href="/olympic-facts" className="btn btn-outline btn-large">
                Découvrir les Faits
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
