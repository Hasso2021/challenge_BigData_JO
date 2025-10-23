// webapp/frontend/src/pages/Predictions.js
import React, { useEffect, useMemo, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend,
} from 'chart.js';
import api from '../services/api';
import './Predictions.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Selector = ({ model, setModel }) => (
  <div className="pred-controls">
    <label>Model:&nbsp;</label>
    <select value={model} onChange={e => setModel(e.target.value)}>
      <option value="ma">Moving Average (last 5 Games)</option>
      <option value="es">Exponential Smoothing</option>
    </select>
  </div>
);

const Predictions = () => {
  const [model, setModel] = useState('ma');
  const [france, setFrance] = useState(null);
  const [topCountries, setTopCountries] = useState([]);
  const [athletes, setAthletes] = useState([]);
  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAll = async () => {
    setLoading(true); setErr(null);
    try {
      const [fr, top, ath] = await Promise.all([
        api.get('/predictions/country', { params: { country: 'France', year: 2024, model } }),
        api.get('/predictions/top25', { params: { top_n: 25, year: 2024, model } }),
        api.get('/predictions/athletes', { params: { limit: 50 } }),
      ]);
      setFrance(fr.data?.predictions ?? null);
      setTopCountries(top.data?.predictions ?? []);
      setAthletes(ath.data?.predictions ?? []);
    } catch (e) {
      setErr(e?.response?.data?.message || e.message || 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); /* eslint-disable-next-line */ }, [model]);

  // ----- Chart data
  const franceData = useMemo(() => {
    if (!france) return null;
    return {
      labels: [france.country],
      datasets: [
        { label: 'Gold', data: [france.gold] },
        { label: 'Silver', data: [france.silver] },
        { label: 'Bronze', data: [france.bronze] },
      ],
    };
  }, [france]);

  const topCountriesData = useMemo(() => {
    if (!topCountries.length) return null;
    const labels = topCountries.map(c => c.country);
    return {
      labels,
      datasets: [
        { label: 'Gold', data: topCountries.map(c => c.gold) },
        { label: 'Silver', data: topCountries.map(c => c.silver) },
        { label: 'Bronze', data: topCountries.map(c => c.bronze) },
      ],
    };
  }, [topCountries]);

  return (
    <div className="predictions-page">
      <div className="container">
        <h1>OLYMPIC MEDAL PREDICTIONS</h1>
        <Selector model={model} setModel={setModel} />

        {err && <div className="error">⚠️ {err}</div>}

        {/* France */}
        <section className="card">
          <h2>France — Estimation médailles (2024)</h2>
          {loading && <p>Chargement…</p>}
          {!loading && franceData && (
            <Bar
              data={franceData}
              options={{
                responsive: true,
                plugins: { legend: { position: 'top' }, title: { display: false } },
                scales: { x: { stacked: true }, y: { stacked: true, beginAtZero: true } },
              }}
            />
          )}
          {!loading && !franceData && <p>Aucune donnée.</p>}
        </section>

        {/* Top 25 */}
        <section className="card">
          <h2>Top 25 — Estimation médailles (2024)</h2>
          {loading && <p>Chargement…</p>}
          {!loading && topCountriesData && (
            <Bar
              data={topCountriesData}
              options={{
                indexAxis: 'y',   // horizontal like your example
                responsive: true,
                plugins: { legend: { position: 'top' } },
                scales: { x: { stacked: true, beginAtZero: true }, y: { stacked: true } },
              }}
            />
          )}
          {!loading && !topCountriesData && <p>Aucune donnée.</p>}
        </section>

        {/* Athletes table */}
        <section className="card">
          <h2>Athlètes — Probabilité de Médaille (Top 50 historique)</h2>
          {loading && <p>Chargement…</p>}
          {!loading && (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr><th>Athlète</th><th>Gold</th><th>Silver</th><th>Bronze</th><th>Probabilité</th></tr>
                </thead>
                <tbody>
                  {athletes.length ? athletes.map((a, i) => (
                    <tr key={i}>
                      <td>{a.athlete}</td>
                      <td>{a.gold}</td>
                      <td>{a.silver}</td>
                      <td>{a.bronze}</td>
                      <td>{(a.prob_medal * 100).toFixed(0)}%</td>
                    </tr>
                  )) : (<tr><td colSpan={5}>Aucune donnée.</td></tr>)}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Predictions;
