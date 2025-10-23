import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/Navigation.css';

const Navigation = () => {
  const location = useLocation();

  return (
    <nav className="navigation">
      <Link to="/" className="nav-brand">
        OLYMPICS
      </Link>
      
      <ul className="nav-links">
        <li>
          <Link 
            to="/data" 
            className={location.pathname === '/data' ? 'active' : ''}
          >
            DATA
          </Link>
        </li>
        
        <li className="dropdown">
          <Link 
            to="/visualizations" 
            className={location.pathname.startsWith('/visualizations') ? 'active' : ''}
          >
            VISUALIZATIONS ▾
          </Link>
          <div className="dropdown-content">
            <Link to="/visualizations/timeline">Médaille Timeline</Link>
            <Link to="/visualizations/gender">Genre & Composition</Link>
            <Link to="/visualizations/gdp">Médailles VS PIB</Link>
            <Link to="/visualizations/world-seasons">Vue Monde - Saisons</Link>
            <Link to="/visualizations/world-sport">Vue Monde - Sport</Link>
          </div>
        </li>
        
        <li>
          <Link 
            to="/analysis" 
            className={location.pathname === '/analysis' ? 'active' : ''}
          >
            ANALYSIS
          </Link>
        </li>
        
        <li>
          <Link 
            to="/olympic-facts" 
            className={location.pathname === '/olympic-facts' ? 'active' : ''}
          >
            OLYMPIC FACTS
          </Link>
        </li>
        
        <li>
          <Link 
            to="/predictions" 
            className={location.pathname === '/predictions' ? 'active' : ''}
          >
            OLYMPIC MEDAL PREDICTIONS
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;
