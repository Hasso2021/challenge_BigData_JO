import React, { useState, useEffect } from 'react';
import { olympicDataService } from '../services/api';
import { testBackendConnection } from '../utils/testConnection';
import './DataViewer.css';

const DataViewer = ({ dataSource, onClose }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [connectionStatus, setConnectionStatus] = useState(null);

  const itemsPerPage = 20;

  // Données de démonstration en cas de problème de connexion
  const demoData = {
    athletes: [
      { name: 'Michael Phelps', country: 'USA', sport: 'Swimming', year: 2008, gender: 'M', age: 23 },
      { name: 'Usain Bolt', country: 'Jamaica', sport: 'Athletics', year: 2008, gender: 'M', age: 22 },
      { name: 'Simone Biles', country: 'USA', sport: 'Gymnastics', year: 2016, gender: 'F', age: 19 },
      { name: 'Serena Williams', country: 'USA', sport: 'Tennis', year: 2012, gender: 'F', age: 31 },
      { name: 'Lionel Messi', country: 'Argentina', sport: 'Football', year: 2008, gender: 'M', age: 21 }
    ],
    medals: [
      { athlete_name: 'Michael Phelps', country: 'USA', sport: 'Swimming', event: '100m Butterfly', medal_type: 'Gold', year: 2008 },
      { athlete_name: 'Usain Bolt', country: 'Jamaica', sport: 'Athletics', event: '100m', medal_type: 'Gold', year: 2008 },
      { athlete_name: 'Simone Biles', country: 'USA', sport: 'Gymnastics', event: 'All-Around', medal_type: 'Gold', year: 2016 },
      { athlete_name: 'Serena Williams', country: 'USA', sport: 'Tennis', event: 'Singles', medal_type: 'Gold', year: 2012 },
      { athlete_name: 'Lionel Messi', country: 'Argentina', sport: 'Football', event: 'Team', medal_type: 'Gold', year: 2008 }
    ],
    results: [
      { athlete_name: 'Michael Phelps', country: 'USA', sport: 'Swimming', event: '100m Butterfly', position: 1, year: 2008 },
      { athlete_name: 'Usain Bolt', country: 'Jamaica', sport: 'Athletics', event: '100m', position: 1, year: 2008 },
      { athlete_name: 'Simone Biles', country: 'USA', sport: 'Gymnastics', event: 'All-Around', position: 1, year: 2016 },
      { athlete_name: 'Serena Williams', country: 'USA', sport: 'Tennis', event: 'Singles', position: 1, year: 2012 },
      { athlete_name: 'Lionel Messi', country: 'Argentina', sport: 'Football', event: 'Team', position: 1, year: 2008 }
    ],
    hosts: [
      { city: 'Beijing', country: 'China', year: 2008, season: 'Summer', participating_countries: 204 },
      { city: 'London', country: 'UK', year: 2012, season: 'Summer', participating_countries: 204 },
      { city: 'Rio de Janeiro', country: 'Brazil', year: 2016, season: 'Summer', participating_countries: 207 },
      { city: 'Tokyo', country: 'Japan', year: 2020, season: 'Summer', participating_countries: 206 },
      { city: 'Vancouver', country: 'Canada', year: 2010, season: 'Winter', participating_countries: 82 }
    ]
  };

  // Configuration des filtres par type de données
  const filterConfigs = {
    athletes: {
      country: { type: 'select', label: 'Pays', options: ['USA', 'Jamaica', 'China', 'UK', 'Brazil', 'Japan', 'Canada'] },
      sport: { type: 'select', label: 'Sport', options: ['Swimming', 'Athletics', 'Gymnastics', 'Tennis', 'Football'] },
      year: { type: 'range', label: 'Année', min: 2000, max: 2020 },
      gender: { type: 'select', label: 'Genre', options: ['M', 'F'] }
    },
    medals: {
      country: { type: 'select', label: 'Pays', options: ['USA', 'Jamaica', 'China', 'UK', 'Brazil', 'Japan', 'Canada'] },
      medal_type: { type: 'select', label: 'Type de Médaille', options: ['Gold', 'Silver', 'Bronze'] },
      year: { type: 'range', label: 'Année', min: 2000, max: 2020 },
      sport: { type: 'select', label: 'Sport', options: ['Swimming', 'Athletics', 'Gymnastics', 'Tennis', 'Football'] }
    },
    results: {
      country: { type: 'select', label: 'Pays', options: ['USA', 'Jamaica', 'China', 'UK', 'Brazil', 'Japan', 'Canada'] },
      sport: { type: 'select', label: 'Sport', options: ['Swimming', 'Athletics', 'Gymnastics', 'Tennis', 'Football'] },
      year: { type: 'range', label: 'Année', min: 2000, max: 2020 },
      season: { type: 'select', label: 'Saison', options: ['Summer', 'Winter'] }
    },
    hosts: {
      country: { type: 'select', label: 'Pays', options: ['China', 'UK', 'Brazil', 'Japan', 'Canada'] },
      year: { type: 'range', label: 'Année', min: 2000, max: 2020 },
      season: { type: 'select', label: 'Saison', options: ['Summer', 'Winter'] }
    }
  };

  // Tester la connexion backend
  const testConnection = async () => {
    const result = await testBackendConnection();
    setConnectionStatus(result);
    return result.connected;
  };

  // Charger les données
  const loadData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Tester la connexion d'abord
      const isConnected = await testConnection();
      
      if (!isConnected) {
        throw new Error('Backend non accessible. Utilisation des données de démonstration.');
      }
      let response;
      const params = {
        ...filters,
        page: currentPage,
        limit: itemsPerPage,
        search: searchTerm,
        sort_by: sortBy,
        sort_order: sortOrder
      };

      console.log('Tentative de chargement des données pour:', dataSource.id, 'avec params:', params);

      switch (dataSource.id) {
        case 'athletes':
          response = await olympicDataService.getAthletes(params);
          break;
        case 'medals':
          response = await olympicDataService.getMedals(params);
          break;
        case 'results':
          response = await olympicDataService.getResults(params);
          break;
        case 'hosts':
          response = await olympicDataService.getHosts(params);
          break;
        default:
          throw new Error('Type de données non supporté');
      }
      
      console.log('Réponse reçue:', response);
      
      // Gérer la structure de réponse du backend Flask
      const responseData = response.data;
      if (responseData && responseData.status === 'success') {
        setData(responseData.data || []);
        setTotalPages(Math.ceil((responseData.total || responseData.data?.length || 0) / itemsPerPage));
      } else {
        throw new Error(responseData?.message || 'Erreur lors du chargement des données');
      }
    } catch (err) {
      console.error('Erreur lors du chargement:', err);
      
      // En cas d'erreur, utiliser les données de démonstration
      console.log('Utilisation des données de démonstration pour:', dataSource.id);
      const demoDataForSource = demoData[dataSource.id] || [];
      setData(demoDataForSource);
      setTotalPages(1);
      setError(`Mode démonstration: ${err.message}. Les données affichées sont des exemples.`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (dataSource) {
      loadData();
    }
  }, [dataSource, currentPage, filters, searchTerm, sortBy, sortOrder]);

  const handleFilterChange = (filterKey, value) => {
    setFilters(prev => ({
      ...prev,
      [filterKey]: value
    }));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({});
    setSearchTerm('');
    setSortBy('');
    setSortOrder('asc');
    setCurrentPage(1);
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const renderTableHeader = () => {
    const headers = {
      athletes: ['Nom', 'Pays', 'Sport', 'Année', 'Genre', 'Âge'],
      medals: ['Athlète', 'Pays', 'Sport', 'Événement', 'Médaille', 'Année'],
      results: ['Athlète', 'Pays', 'Sport', 'Événement', 'Position', 'Année'],
      hosts: ['Ville', 'Pays', 'Année', 'Saison', 'Pays Participants']
    };

    return headers[dataSource.id]?.map((header, index) => (
      <th 
        key={index}
        onClick={() => handleSort(header.toLowerCase())}
        className="sortable"
      >
        {header}
        {sortBy === header.toLowerCase() && (
          <span className="sort-indicator">
            {sortOrder === 'asc' ? '↑' : '↓'}
          </span>
        )}
      </th>
    ));
  };

  const renderTableRow = (item, index) => {
    switch (dataSource.id) {
      case 'athletes':
        return (
          <tr key={index}>
            <td>{item.name || 'N/A'}</td>
            <td>{item.country || 'N/A'}</td>
            <td>{item.sport || 'N/A'}</td>
            <td>{item.year || 'N/A'}</td>
            <td>{item.gender || 'N/A'}</td>
            <td>{item.age || 'N/A'}</td>
          </tr>
        );
      case 'medals':
        return (
          <tr key={index}>
            <td>{item.athlete_name || 'N/A'}</td>
            <td>{item.country || 'N/A'}</td>
            <td>{item.sport || 'N/A'}</td>
            <td>{item.event || 'N/A'}</td>
            <td>
              <span className={`medal-badge ${item.medal_type?.toLowerCase()}`}>
                {item.medal_type || 'N/A'}
              </span>
            </td>
            <td>{item.year || 'N/A'}</td>
          </tr>
        );
      case 'results':
        return (
          <tr key={index}>
            <td>{item.athlete_name || 'N/A'}</td>
            <td>{item.country || 'N/A'}</td>
            <td>{item.sport || 'N/A'}</td>
            <td>{item.event || 'N/A'}</td>
            <td>{item.position || 'N/A'}</td>
            <td>{item.year || 'N/A'}</td>
          </tr>
        );
      case 'hosts':
        return (
          <tr key={index}>
            <td>{item.city || 'N/A'}</td>
            <td>{item.country || 'N/A'}</td>
            <td>{item.year || 'N/A'}</td>
            <td>{item.season || 'N/A'}</td>
            <td>{item.participating_countries || 'N/A'}</td>
          </tr>
        );
      default:
        return null;
    }
  };

  const renderFilters = () => {
    const config = filterConfigs[dataSource.id];
    if (!config) return null;

    return Object.entries(config).map(([key, config]) => (
      <div key={key} className="filter-group">
        <label>{config.label}:</label>
        {config.type === 'select' ? (
          <select
            value={filters[key] || ''}
            onChange={(e) => handleFilterChange(key, e.target.value)}
          >
            <option value="">Tous</option>
            {config.options.map((option, index) => (
              <option key={index} value={option}>{option}</option>
            ))}
          </select>
        ) : config.type === 'range' ? (
          <div className="range-inputs">
            <input
              type="number"
              placeholder={`Min (${config.min})`}
              min={config.min}
              max={config.max}
              value={filters[`${key}_min`] || ''}
              onChange={(e) => handleFilterChange(`${key}_min`, e.target.value)}
            />
            <input
              type="number"
              placeholder={`Max (${config.max})`}
              min={config.min}
              max={config.max}
              value={filters[`${key}_max`] || ''}
              onChange={(e) => handleFilterChange(`${key}_max`, e.target.value)}
            />
          </div>
        ) : null}
      </div>
    ));
  };

  return (
    <div className="data-viewer">
      <div className="viewer-header">
        <h2>Données: {dataSource.title}</h2>
        <div className="header-actions">
          <button 
            className="btn btn-outline" 
            onClick={testConnection}
            title="Tester la connexion backend"
          >
            🔍 Test Connexion
          </button>
          <button className="btn btn-secondary" onClick={onClose}>
            Fermer
          </button>
        </div>
      </div>

      {error && (
        <div className="error-banner">
          <strong>⚠️ Mode Démonstration:</strong> {error}
        </div>
      )}

      <div className="viewer-controls">
        <div className="search-section">
          <input
            type="text"
            placeholder="Rechercher..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filters-section">
          {renderFilters()}
          <button className="btn btn-outline" onClick={clearFilters}>
            Effacer les filtres
          </button>
        </div>
      </div>

      <div className="data-table-container">
        {loading ? (
          <div className="loading">Chargement des données...</div>
        ) : data.length === 0 ? (
          <div className="no-data">Aucune donnée trouvée</div>
        ) : (
          <>
            <table className="data-table">
              <thead>
                <tr>
                  {renderTableHeader()}
                </tr>
              </thead>
              <tbody>
                {data.map((item, index) => renderTableRow(item, index))}
              </tbody>
            </table>

            <div className="pagination">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="btn btn-outline"
              >
                Précédent
              </button>
              <span className="page-info">
                Page {currentPage} sur {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="btn btn-outline"
              >
                Suivant
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DataViewer;