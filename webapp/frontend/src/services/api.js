import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

console.log('🔧 Configuration API:', {
  API_BASE_URL,
  REACT_APP_API_URL: process.env.REACT_APP_API_URL,
  NODE_ENV: process.env.NODE_ENV
});

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour les erreurs
api.interceptors.response.use(
  (response) => {
    console.log('✅ API Response:', {
      url: response.config.url,
      fullURL: response.config.baseURL + response.config.url,
      status: response.status,
      method: response.config.method
    });
    return response;
  },
  (error) => {
    console.error('❌ API Error détaillé:', {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      url: error.config?.url,
      method: error.config?.method,
      baseURL: error.config?.baseURL
    });
    
    // Améliorer les messages d'erreur
    if (error.code === 'ECONNREFUSED') {
      error.message = 'Impossible de se connecter au backend. Vérifiez que le serveur Flask est démarré sur le port 5000.';
    } else if (error.code === 'NETWORK_ERROR') {
      error.message = 'Erreur réseau. Vérifiez votre connexion internet.';
    } else if (error.response?.status === 500) {
      error.message = 'Erreur serveur interne. Vérifiez les logs du backend.';
    }
    
    return Promise.reject(error);
  }
);

// Services pour les données olympiques
export const olympicDataService = {
  // Athlètes
  getAthletes: (params = {}) => {
    return api.get('/athletes', { params });
  },
  getAthleteById: (id) => api.get(`/athletes/${id}`),
  searchAthletes: (query) => api.get('/athletes', { params: { search: query } }),

  // Médailles
  getMedals: (params = {}) => {
    return api.get('/medals', { params });
  },
  getRewards: (params = {}) => {
    return api.get('/rewards', { params });
  },
  getFranceMedals: () => {
    return api.get('/medals/france');
  },
  getFranceSuccess: () => {
    return api.get('/medals/france/success');
  },
  getFranceSports: () => {
    return api.get('/medals/france/sports');
  },
  getDominantSports: () => {
    return api.get('/medals/dominant-sports');
  },
  getCountryPerformance: () => {
    return api.get('/medals/country-performance');
  },
  getTemporalTrends: () => {
    return api.get('/medals/temporal-trends');
  },
  getSuccessFactors: () => {
    return api.get('/medals/success-factors');
  },

  // Résultats olympiques
  getResults: (params = {}) => {
    return api.get('/olympic_results', { params });
  },

  // Villes hôtes
  getHosts: (params = {}) => {
    return api.get('/hosts', { params });
  },
  getHostsRanking: () => {
    return api.get('/hosts/ranking');
  },

  // Statistiques
  getStats: () => api.get('/stats'),
  getCountryStats: (country) => api.get('/stats/country', { params: { country } }),

  // Analyse PIB-Médailles
  getGDPAnalysisSummary: () => {
    return api.get('/gdp-analysis/summary');
  },
  getGDPCorrelationByYear: (years = null) => {
    return api.get('/gdp-analysis/correlation-by-year', { params: years ? { years } : {} });
  },
  getGDPCorrelationBySportCost: (year = 2022) => {
    return api.get('/gdp-analysis/correlation-by-sport-cost', { params: { year } });
  },
  getGDPCorrelationPerCapita: (year = 2022) => {
    return api.get('/gdp-analysis/correlation-gdp-per-capita', { params: { year } });
  },
  getRealGDPMedalsData: () => {
    return api.get('/gdp-analysis/real-gdp-medals-data');
  },

  // Prédictions
  predictCountryMedals: (country, year = 2024, model = 'best') => {
    return api.get(`/predictions/country/${country}`, { 
      params: { year, model } 
    });
  },
  predictTopCountries: (topN = 25, year = 2024, model = 'best') => {
    return api.get('/predictions/top-countries', { 
      params: { top_n: topN, year, model } 
    });
  },
  predictAthleteMedals: (limit = 50, model = 'best') => {
    return api.get('/predictions/athletes', { 
      params: { limit, model } 
    });
  },
  predictSportPerformance: (sport = '', year = 2024, limit = 20) => {
    return api.get('/predictions/sports', { 
      params: { sport, year, limit } 
    });
  },
  getModelsStatus: () => {
    return api.get('/predictions/models/status');
  },
};

export default api;
