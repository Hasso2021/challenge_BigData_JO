import React, { useState, useEffect } from 'react';
import { olympicDataService } from '../services/api';
import './DataViewer.css';

const DataViewer = ({ dataSource, onClose }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');

  const itemsPerPage = 20;

  // No demo data - only use real backend data

  // Configuration des filtres par type de données - basés sur les colonnes principales
  const filterConfigs = {
    athletes: {
      athlete_full_name: { type: 'text', label: 'Nom Complet' },
      athlete_year_birth: { type: 'range', label: 'Année Naissance', min: 1850, max: 2010 },
      games_participations: { type: 'range', label: 'Participations', min: 1, max: 20 },
      first_game: { type: 'text', label: 'Premier Jeu' }
    },
    medals: {
      year: { type: 'range', label: 'Année', min: 1896, max: 2024 },
      sport: { type: 'text', label: 'Sport' },
      event: { type: 'text', label: 'Événement' },
      event_gender: { type: 'select', label: 'Genre', options: ['Men', 'Women', 'Mixed'] },
      noc: { type: 'text', label: 'NOC' },
      country: { type: 'text', label: 'Pays' },
      medal: { type: 'select', label: 'Médaille', options: ['GOLD', 'SILVER', 'BRONZE'] },
      award_count: { type: 'range', label: 'Nombre', min: 1, max: 100 }
    },
    results: {
      year: { type: 'range', label: 'Année', min: 1896, max: 2024 },
      games_slug: { type: 'text', label: 'Jeux' },
      sport: { type: 'text', label: 'Sport' },
      event: { type: 'text', label: 'Événement' },
      event_gender: { type: 'select', label: 'Genre', options: ['Men', 'Women', 'Mixed'] },
      participant_type: { type: 'text', label: 'Type' },
      participant_title: { type: 'text', label: 'Titre' },
      athlete: { type: 'text', label: 'Athlète' }
    },
    hosts: {
      year: { type: 'range', label: 'Année', min: 1896, max: 2024 },
      season: { type: 'select', label: 'Saison', options: ['Summer', 'Winter'] },
      city: { type: 'text', label: 'Ville' },
      country: { type: 'text', label: 'Pays' },
      slug: { type: 'text', label: 'Slug' },
      name: { type: 'text', label: 'Nom' },
      start_date: { type: 'date', label: 'Date Début' },
      end_date: { type: 'date', label: 'Date Fin' }
    }
  };


  // Charger les données
  const loadData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      let response;
      
      // Construire les paramètres de filtrage
      const params = {
        page: currentPage,
        limit: itemsPerPage,
        sort_by: sortBy,
        sort_order: sortOrder
      };

      // Ajouter les filtres seulement s'ils ont des valeurs
      Object.keys(filters).forEach(key => {
        const value = filters[key];
        if (value !== '' && value !== null && value !== undefined) {
          // Gérer les filtres de type range (min/max)
          if (key.includes('_min')) {
            const baseKey = key.replace('_min', '');
            if (!params[baseKey]) params[baseKey] = {};
            params[baseKey].min = value;
          } else if (key.includes('_max')) {
            const baseKey = key.replace('_max', '');
            if (!params[baseKey]) params[baseKey] = {};
            params[baseKey].max = value;
          } else {
            // Filtres normaux
            params[key] = value;
          }
        }
      });

      console.log('Chargement des données pour:', dataSource.id);
      console.log('Filtres actuels:', filters);
      console.log('Paramètres envoyés:', params);

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
        setTotalPages(responseData.total_pages || Math.ceil((responseData.total || responseData.data?.length || 0) / itemsPerPage));
      } else {
        throw new Error(responseData?.message || 'Erreur lors du chargement des données');
      }
    } catch (err) {
      console.error('Erreur lors du chargement:', err);
      setError(`Erreur de connexion: ${err.message}. Vérifiez que le backend est démarré.`);
      setData([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (dataSource) {
      loadData();
    }
  }, [dataSource, currentPage, sortBy, sortOrder]);

  const handleFilterChange = (filterKey, value) => {
    setFilters(prev => {
      const newFilters = {
        ...prev,
        [filterKey]: value
      };
      console.log('Filter changed:', filterKey, value, 'New filters:', newFilters);
      return newFilters;
    });
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({});
    setSortBy('');
    setSortOrder('asc');
    setCurrentPage(1);
    // Reload data with cleared filters
    loadData();
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
      athletes: ['Nom Complet', 'URL', 'Année Naissance', 'Participations', 'Premier Jeu', 'Première Année', 'Médailles Total', 'Bio'],
      medals: ['Année', 'Sport', 'Événement', 'Genre', 'NOC', 'Pays', 'Médaille', 'Nombre'],
      results: ['Année', 'Jeux', 'Sport', 'Événement', 'Genre', 'Type', 'Titre', 'Athlète', 'URL', 'Pays', 'Code', 'NOC', 'Médaille', 'Or', 'Argent', 'Bronze', 'Équipe', 'Créé'],
      hosts: ['Année', 'Saison', 'Ville', 'Pays', 'Slug', 'Nom', 'Date Début', 'Date Fin', 'Durée (jours)']
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
            <td>{item.athlete_full_name || 'N/A'}</td>
            <td>
              {item.athlete_url ? (
                <a href={item.athlete_url} target="_blank" rel="noopener noreferrer" style={{color: '#3b82f6', textDecoration: 'none'}}>
                  Lien
                </a>
              ) : 'N/A'}
            </td>
            <td>{item.athlete_year_birth || 'N/A'}</td>
            <td>{item.games_participations || 'N/A'}</td>
            <td>{item.first_game || 'N/A'}</td>
            <td>{item.first_year || 'N/A'}</td>
            <td>{item.medal_total || 'N/A'}</td>
            <td style={{maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>
              {item.bio || 'N/A'}
            </td>
          </tr>
        );
      case 'medals':
        return (
          <tr key={index}>
            <td>{item.year || 'N/A'}</td>
            <td>{item.sport || 'N/A'}</td>
            <td>{item.event || 'N/A'}</td>
            <td>{item.event_gender || 'N/A'}</td>
            <td>{item.noc || 'N/A'}</td>
            <td>{item.country || 'N/A'}</td>
            <td>
              <span className={`medal-badge ${item.medal?.toLowerCase()}`}>
                {item.medal || 'N/A'}
              </span>
            </td>
            <td>{item.award_count || 'N/A'}</td>
          </tr>
        );
      case 'results':
        return (
          <tr key={index}>
            <td>{item.year || 'N/A'}</td>
            <td>{item.games_slug || 'N/A'}</td>
            <td>{item.sport || 'N/A'}</td>
            <td>{item.event || 'N/A'}</td>
            <td>{item.event_gender || 'N/A'}</td>
            <td>{item.participant_type || 'N/A'}</td>
            <td>{item.participant_title || 'N/A'}</td>
            <td>{item.athlete || 'N/A'}</td>
            <td>
              {item.athlete_url ? (
                <a href={item.athlete_url} target="_blank" rel="noopener noreferrer" style={{color: '#3b82f6', textDecoration: 'none'}}>
                  Lien
                </a>
              ) : 'N/A'}
            </td>
            <td>{item.country || 'N/A'}</td>
            <td>{item.country_code || 'N/A'}</td>
            <td>{item.noc || 'N/A'}</td>
            <td>
              <span className={`medal-badge ${item.medal?.toLowerCase()}`}>
                {item.medal || 'N/A'}
              </span>
            </td>
            <td>{item.gold ? 'Oui' : 'Non'}</td>
            <td>{item.silver ? 'Oui' : 'Non'}</td>
            <td>{item.bronze ? 'Oui' : 'Non'}</td>
            <td>{item.is_team ? 'Oui' : 'Non'}</td>
            <td>{item.created_at ? new Date(item.created_at).toLocaleDateString() : 'N/A'}</td>
          </tr>
        );
      case 'hosts':
        return (
          <tr key={index}>
            <td>{item.year || 'N/A'}</td>
            <td>{item.season || 'N/A'}</td>
            <td>{item.city || 'N/A'}</td>
            <td>{item.country || 'N/A'}</td>
            <td>{item.slug || 'N/A'}</td>
            <td>{item.name || 'N/A'}</td>
            <td>{item.start_date || 'N/A'}</td>
            <td>{item.end_date || 'N/A'}</td>
            <td>{item.duration_days || 'N/A'}</td>
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
        ) : config.type === 'text' ? (
          <input
            type="text"
            placeholder={`Rechercher ${config.label.toLowerCase()}`}
            value={filters[key] || ''}
            onChange={(e) => handleFilterChange(key, e.target.value)}
          />
        ) : config.type === 'date' ? (
          <input
            type="date"
            value={filters[key] || ''}
            onChange={(e) => handleFilterChange(key, e.target.value)}
          />
        ) : null}
      </div>
    ));
  };

  return (
    <div className="data-viewer">
      <div className="viewer-header">
        <div className="header-info">
          <h2>Données: {dataSource.title}</h2>
          <p className="data-description">{dataSource.description}</p>
          {data.length > 0 && (
            <div className="data-stats">
              <span className="stat-item">
                📊 {data.length} enregistrement{data.length > 1 ? 's' : ''} affiché{data.length > 1 ? 's' : ''}
              </span>
              {totalPages > 1 && (
                <span className="stat-item">
                  📄 Page {currentPage} sur {totalPages}
                </span>
              )}
            </div>
          )}
        </div>
        <div className="header-actions">
          <button className="btn btn-secondary" onClick={onClose}>
            Fermer
          </button>
        </div>
      </div>

      {error && (
        <div className="error-banner">
          <strong>⚠️ Erreur de Connexion:</strong> {error}
          <div style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>
            <strong>Solutions:</strong>
            <ul style={{ margin: '0.5rem 0 0 1rem', padding: 0 }}>
              <li>Vérifiez que le backend Flask est démarré sur le port 5000</li>
              <li>Assurez-vous que la base de données Supabase est accessible</li>
              <li>Vérifiez la configuration de l'API dans les variables d'environnement</li>
            </ul>
          </div>
        </div>
      )}

      <div className="viewer-controls">
        <div className="filters-section">
          <div className="filters-grid">
            {renderFilters()}
          </div>
          <div className="filter-actions">
            <button className="btn btn-primary" onClick={loadData}>
              🔍 Appliquer les filtres
            </button>
            <button className="btn btn-outline" onClick={clearFilters}>
              Effacer les filtres
            </button>
          </div>
        </div>
      </div>

          <div className="data-table-container">
            {loading ? (
              <div className="loading">Chargement des données...</div>
            ) : data.length === 0 ? (
              <div className="no-data">Aucune donnée trouvée</div>
            ) : (
              <>
                {data.length > 0 && (
                  <div className="table-stats-bar">
                    <div className="stats-info">
                      <span className="record-count">
                        📊 {data.length} enregistrement{data.length > 1 ? 's' : ''} affiché{data.length > 1 ? 's' : ''}
                      </span>
                      {totalPages > 1 && (
                        <span className="page-count">
                          📄 Page {currentPage} sur {totalPages}
                        </span>
                      )}
                    </div>
                  </div>
                )}
                <table className={`data-table ${dataSource.id === 'athletes' ? 'athletes-table' : dataSource.id === 'results' ? 'results-table' : dataSource.id === 'hosts' ? 'hosts-table' : dataSource.id === 'medals' ? 'medals-table' : ''}`}>
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
                📄 Page {currentPage} sur {totalPages}
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