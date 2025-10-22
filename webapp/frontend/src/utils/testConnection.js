// Utilitaire pour tester la connexion avec le backend
export const testBackendConnection = async () => {
  try {
    const response = await fetch('http://localhost:5000/api/athletes?limit=1');
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Backend connecté:', data);
      return { connected: true, data };
    } else {
      console.log('❌ Backend répond mais avec erreur:', response.status);
      return { connected: false, error: `HTTP ${response.status}` };
    }
  } catch (error) {
    console.log('❌ Backend non accessible:', error.message);
    return { connected: false, error: error.message };
  }
};

// Test de tous les endpoints
export const testAllEndpoints = async () => {
  const endpoints = [
    { name: 'Athlètes', url: '/api/athletes' },
    { name: 'Médailles', url: '/api/medals' },
    { name: 'Résultats', url: '/api/olympic_results' },
    { name: 'Villes Hôtes', url: '/api/hosts' }
  ];

  const results = {};
  
  for (const endpoint of endpoints) {
    try {
      const response = await fetch(`http://localhost:5000${endpoint.url}?limit=1`);
      results[endpoint.name] = {
        connected: response.ok,
        status: response.status,
        data: response.ok ? await response.json() : null
      };
    } catch (error) {
      results[endpoint.name] = {
        connected: false,
        error: error.message
      };
    }
  }
  
  console.log('📊 Résultats des tests:', results);
  return results;
};
