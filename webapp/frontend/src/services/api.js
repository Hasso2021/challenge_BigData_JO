import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour les erreurs
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

// Services pour les données olympiques
export const olympicDataService = {
  // Athlètes
  getAthletes: (params = {}) => {
    const queryParams = {
      limit: params.limit || 20,
      page: params.page || 1,
      ...params
    };
    return api.get('/athletes', { params: queryParams });
  },
  getAthleteById: (id) => api.get(`/athletes/${id}`),
  searchAthletes: (query) => api.get('/athletes', { params: { search: query } }),

  // Médailles
  getMedals: (params = {}) => {
    const queryParams = {
      limit: params.limit || 20,
      page: params.page || 1,
      ...params
    };
    return api.get('/medals', { params: queryParams });
  },
  getRewards: (params = {}) => {
    const queryParams = {
      limit: params.limit || 20,
      page: params.page || 1,
      ...params
    };
    return api.get('/rewards', { params: queryParams });
  },

  // Résultats olympiques
  getResults: (params = {}) => {
    const queryParams = {
      limit: params.limit || 20,
      page: params.page || 1,
      ...params
    };
    return api.get('/olympic_results', { params: queryParams });
  },

  // Villes hôtes
  getHosts: (params = {}) => {
    const queryParams = {
      limit: params.limit || 50,
      page: params.page || 1,
      ...params
    };
    return api.get('/hosts', { params: queryParams });
  },

  // Statistiques
  getStats: () => api.get('/stats'),
  getCountryStats: (country) => api.get('/stats/country', { params: { country } }),

  // Predictions 
  predictCountry: (country = 'France', year = 2024, model = 'best') => api.get('/predictions/country', { params: { country, year, model } }),
  predictTopCountries: (top_n = 25, year = 2024, model = 'best') => api.get('/predictions/top25', { params: { top_n, year, model } }),
  predictAthletes: (limit = 50, model = 'best') => api.get('/predictions/athletes', { params: { limit, model } }),
};

export default api;
