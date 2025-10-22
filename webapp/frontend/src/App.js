import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import OlympicFacts from './pages/OlympicFacts';
import Data from './pages/Data';
import Visualizations from './pages/Visualizations';
import Analysis from './pages/Analysis';
import Predictions from './pages/Predictions';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Navigation />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/olympic-facts" element={<OlympicFacts />} />
            <Route path="/data" element={<Data />} />
            <Route path="/visualizations" element={<Visualizations />} />
            <Route path="/analysis" element={<Analysis />} />
            <Route path="/predictions" element={<Predictions />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
