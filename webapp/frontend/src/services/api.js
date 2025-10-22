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
};

export default api;
