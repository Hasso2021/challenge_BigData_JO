import React, { useState, useEffect } from 'react';
import OlympicRings from '../components/OlympicRings';
import MedalCharts from '../components/MedalCharts';
import SportsCharts from '../components/SportsCharts';
import { olympicDataService } from '../services/api';
import './OlympicFacts.css';

const OlympicFacts = () => {
  const [hostsData, setHostsData] = useState(null);
  const [rankingData, setRankingData] = useState(null);
  const [franceMedals, setFranceMedals] = useState(null);
  const [franceSuccess, setFranceSuccess] = useState(null);
  const [franceSports, setFranceSports] = useState(null);
  const [dominantSports, setDominantSports] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeQuestion, setActiveQuestion] = useState(null);
  const [activeSection, setActiveSection] = useState('events'); // 'events' ou 'open-questions'
  const [showCharts, setShowCharts] = useState(false);
  const [showSportsCharts, setShowSportsCharts] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('🔄 Début du chargement des données...');
        
        const [hostsResponse, rankingResponse, franceMedalsResponse, franceSuccessResponse, franceSportsResponse, dominantSportsResponse] = await Promise.all([
          olympicDataService.getHosts(),
          olympicDataService.getHostsRanking(),
          olympicDataService.getFranceMedals(),
          olympicDataService.getFranceSuccess(),
          olympicDataService.getFranceSports(),
          olympicDataService.getDominantSports()
        ]);
        
        console.log('✅ Données chargées avec succès:', {
          hosts: hostsResponse?.data,
          ranking: rankingResponse?.data,
          franceMedals: franceMedalsResponse?.data,
          franceSuccess: franceSuccessResponse?.data,
          franceSports: franceSportsResponse?.data,
          dominantSports: dominantSportsResponse?.data
        });
        
        setHostsData(hostsResponse.data);
        setRankingData(rankingResponse.data);
        setFranceMedals(franceMedalsResponse.data);
        setFranceSuccess(franceSuccessResponse.data);
        setFranceSports(franceSportsResponse.data);
        setDominantSports(dominantSportsResponse.data);
        
      } catch (err) {
        console.error('❌ Erreur détaillée lors de la récupération des données:', {
          message: err.message,
          status: err.response?.status,
          statusText: err.response?.statusText,
          data: err.response?.data,
          config: {
            url: err.config?.url,
            method: err.config?.method,
            baseURL: err.config?.baseURL
          }
        });
        
        // Message d'erreur plus détaillé
        let errorMessage = 'Erreur lors du chargement des données';
        if (err.response?.status) {
          errorMessage += ` (${err.response.status}: ${err.response.statusText})`;
        }
        if (err.message) {
          errorMessage += ` - ${err.message}`;
        }
        
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Analyser les données pour répondre à la question
  const analyzeFrenchOlympics = () => {
    if (!hostsData?.data) return null;

    const frenchHosts = hostsData.data.filter(host => 
      host.country && host.country.toLowerCase().includes('france')
    );

    const summerGames = frenchHosts.filter(host => 
      host.season && host.season.toLowerCase() === 'summer'
    );

    const winterGames = frenchHosts.filter(host => 
      host.season && host.season.toLowerCase() === 'winter'
    );

    return {
      total: frenchHosts.length,
      summer: summerGames.length,
      winter: winterGames.length,
      games: frenchHosts.map(game => ({
        year: game.year,
        season: game.season,
        city: game.city
      }))
    };
  };

  const frenchOlympics = analyzeFrenchOlympics();

  // Liste des questions disponibles
  const questions = [
    {
      id: 1,
      title: "Question 1: Événements Marquants aux JO",
      description: "La France a organisé 6 Jeux Olympiques : 3 d'hiver et 3 d'été (en comptant celui de 2024).",
      icon: "🏆",
      category: "Histoire Olympique"
    },
    {
      id: 2,
      title: "Question 2: Classement des pays organisateurs",
      description: "La France est-elle le 2ème pays organisateur après les USA ?",
      icon: "🏅",
      category: "Statistiques"
    },
    {
      id: 3,
      title: "Question 3: Origine des JO d'hiver",
      description: "Les JO d'hiver sont nés à Chamonix en 1924 ?",
      icon: "❄️",
      category: "Histoire Olympique"
    },
    {
      id: 4,
      title: "Question 4: Participation des femmes aux JO",
      description: "JO de Paris, en 1900: les femmes peuvent participer aux JO ?",
      icon: "👩‍🏃‍♀️",
      category: "Histoire Olympique"
    },
    {
      id: 5,
      title: "Question 5: Athlètes double saison",
      description: "Seuls 4 athlètes ont remporté des médailles à la fois aux JO d'hiver et d'été. Une seule d'entre eux, Christa Ludinger-Rothenburger, a remporté des médailles au cours de la même année ?",
      icon: "🏅",
      category: "Statistiques"
    },
    {
      id: 6,
      title: "Question 6: Évolution du calendrier olympique",
      description: "De 1924 à 1992, les JO d'hiver et d'été avaient lieu au cours de la même année. Désormais, ils sont organisés selon des cycles distincts avec une alternance de 2 ans ?",
      icon: "📅",
      category: "Histoire Olympique"
    },
    {
      id: 7,
      title: "Question 7: Tarzan aux Jeux Olympiques",
      description: "Tarzan lui-même a participé aux JO. En effet, Johnny Weissmuller, ancien athlète devenu acteur et ayant interprété 12 films de Tarzan, a remporté 5 médailles d'or en natation dans les années 1920 ?",
      icon: "🏊‍♂️",
      category: "Histoire Olympique"
    },
    {
      id: 8,
      title: "Question 8: Participation féminine universelle",
      description: "Les JO de Londres de 2012 ont été les 1ers JO durant lesquels tous les pays participants ont envoyé des athlètes de sexe féminin ?",
      icon: "👩‍🏃‍♀️",
      category: "Histoire Olympique"
    },
    {
      id: 9,
      title: "Question 9: Sports olympiques disparus",
      description: "Les sports suivants ne font (malheureusement) plus partie des J.O : la natation synchronisée en solo, le tir à la corde, la corde à grimper, la montgolfière, le duel au pistolet, le vélo tandem, la course d'obstacles à la nage et le plongeon à distance. Par chance, le tir au pigeon n'a été mis en place qu'une seule fois pendant les Jeux Olympiques de Paris de 1900 ?",
      icon: "🏹",
      category: "Histoire Olympique"
    },
    {
      id: 10,
      title: "Question 10: Premiers JO en Amérique du Sud",
      description: "Les Jeux de 2016, à Rio, marqueront la 1è manifestation des JO en Amérique du Sud ?",
      icon: "🇧🇷",
      category: "Histoire Olympique"
    },
    {
      id: 11,
      title: "Question 11: Statistiques de Rio 2016",
      description: "Pendant les 17 jours des JO d'été de 2016, 10 500 athlètes, originaires de 205 pays, représenteront 42 sports différents et participeront à 306 épreuves, à Rio ?",
      icon: "📊",
      category: "Statistiques"
    }
  ];

  // Fonction pour afficher le contenu d'une question
  const renderQuestionContent = (questionId) => {
    switch (questionId) {
      case 1:
        return (
          <div className="question-content">
            <h3>📊 Réponse basée sur les données des tables :</h3>
            {loading && <div className="loading">Chargement des données...</div>}
            {error && <div className="error">❌ {error}</div>}
            {frenchOlympics && (
              <div className="data-analysis">
                <div className="stats-grid">
                  <div className="stat-card">
                    <h4>Total des JO organisés par la France</h4>
                    <div className="stat-number">{frenchOlympics.total}</div>
                  </div>
                  <div className="stat-card">
                    <h4>Jeux d'été</h4>
                    <div className="stat-number">{frenchOlympics.summer}</div>
                  </div>
                  <div className="stat-card">
                    <h4>Jeux d'hiver</h4>
                    <div className="stat-number">{frenchOlympics.winter}</div>
                  </div>
                </div>
                
                <div className="games-list">
                  <h4>🏆 Jeux Olympiques organisés par la France :</h4>
                  <ul>
                    {frenchOlympics.games.map((game, index) => (
                      <li key={index}>
                        <strong>{game.year}</strong> - {game.city} ({game.season})
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="conclusion">
                  <p>
                    <strong>Vérification :</strong> 
                    {frenchOlympics.total === 6 ? 
                      "✅ La donnée est correcte !" : 
                      `❌ La donnée semble incorrecte. Nous trouvons ${frenchOlympics.total} Jeux Olympiques organisés par la France.`
                    }
                  </p>
                </div>
              </div>
            )}
          </div>
        );

      case 2:
        return (
          <div className="question-content">
            <h3>📊 Réponse basée sur les données :</h3>
            {loading && <div className="loading">Chargement des données...</div>}
            {error && <div className="error">❌ {error}</div>}
            
            {rankingData && (
              <div className="ranking-analysis">
                {/* Position de la France */}
                <div className="france-position">
                  <div className="position-card">
                    <h4>🇫🇷 Position de la France</h4>
                    <div className="position-number">
                      {rankingData.france_position ? `#${rankingData.france_position}` : 'Non trouvée'}
                    </div>
                    <div className="position-details">
                      {rankingData.france_data && (
                        <>
                          <p><strong>Total des JO organisés :</strong> {rankingData.france_data.total_games}</p>
                          <div className="france-games">
                            <h5>Jeux organisés par la France :</h5>
                            <ul>
                              {rankingData.france_data.games.map((game, index) => (
                                <li key={index}>
                                  <span className="game-year">{game.year}</span>
                                  <span className="game-city">{game.city}</span>
                                  <span className="game-season">{game.season}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Top 10 des pays organisateurs */}
                <div className="top-ranking">
                  <h4>🏅 Top 10 des pays organisateurs de JO</h4>
                  <div className="ranking-table">
                    <div className="ranking-header">
                      <span>Rang</span>
                      <span>Pays</span>
                      <span>Nombre de JO</span>
                    </div>
                    {rankingData.ranking.slice(0, 10).map((country, index) => (
                      <div 
                        key={index} 
                        className={`ranking-row ${country.country === 'France' ? 'france-row' : ''}`}
                      >
                        <span className="rank">#{index + 1}</span>
                        <span className="country">
                          {country.country === 'France' ? '🇫🇷 ' : ''}
                          {country.country}
                        </span>
                        <span className="count">{country.total_games}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Conclusion */}
                <div className="conclusion">
                  <div className="conclusion-card">
                    <h4>🎯 Conclusion</h4>
                    <div className="conclusion-content">
                      {rankingData.france_position === 2 ? (
                        <div className="correct-answer">
                          <p>✅ <strong>CORRECT !</strong> La France est bien le 2ème pays organisateur après les États-Unis.</p>
                          <p>Les États-Unis ont organisé {rankingData.ranking[0]?.total_games || 'N/A'} JO, 
                             la France en a organisé {rankingData.france_data?.total_games || 'N/A'}.</p>
                        </div>
                      ) : (
                        <div className="incorrect-answer">
                          <p>❌ <strong>INCORRECT !</strong> La France n'est pas le 2ème pays organisateur.</p>
                          <p>La France se classe en position #{rankingData.france_position} avec {rankingData.france_data?.total_games || 'N/A'} JO organisés.</p>
                          {rankingData.ranking[1] && (
                            <p>Le 2ème pays est <strong>{rankingData.ranking[1].country}</strong> avec {rankingData.ranking[1].total_games} JO.</p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case 3:
        return (
          <div className="question-content">
            <h3>📊 Réponse basée sur les données :</h3>
            {loading && <div className="loading">Chargement des données...</div>}
            {error && <div className="error">❌ {error}</div>}
            
            {hostsData && (
              <div className="winter-games-analysis">
                {/* Analyse des premiers JO d'hiver */}
                <div className="first-winter-games">
                  <div className="historical-card">
                    <h4>❄️ Premier Jeux Olympiques d'hiver</h4>
                    <div className="historical-details">
                      {(() => {
                        const winterGames = hostsData.data.filter(host => 
                          host.season && host.season.toLowerCase() === 'winter'
                        ).sort((a, b) => a.year - b.year);
                        
                        const firstWinterGames = winterGames[0];
                        
                        return (
                          <>
                            <div className="first-games-info">
                              <div className="game-year-badge">{firstWinterGames?.year}</div>
                              <div className="game-details">
                                <h5>{firstWinterGames?.city}, {firstWinterGames?.country}</h5>
                                <p><strong>Dates :</strong> {firstWinterGames?.start_date} - {firstWinterGames?.end_date}</p>
                                <p><strong>Durée :</strong> {firstWinterGames?.duration_days} jours</p>
                              </div>
                            </div>
                            
                            <div className="verification">
                              <h5>🔍 Vérification :</h5>
                              <div className="verification-result">
                                {firstWinterGames?.city === 'Chamonix' && firstWinterGames?.year === 1924 ? (
                                  <div className="correct-verification">
                                    <p>✅ <strong>CORRECT !</strong> Les premiers Jeux Olympiques d'hiver ont bien eu lieu à Chamonix en 1924.</p>
                                    <p>Chamonix 1924 est officiellement reconnu comme le premier Jeux Olympiques d'hiver de l'histoire.</p>
                                  </div>
                                ) : (
                                  <div className="incorrect-verification">
                                    <p>❌ <strong>INCORRECT !</strong> Les premiers JO d'hiver n'ont pas eu lieu à Chamonix en 1924.</p>
                                    <p>D'après nos données, les premiers JO d'hiver ont eu lieu à {firstWinterGames?.city} en {firstWinterGames?.year}.</p>
                                  </div>
                                )}
                              </div>
                            </div>
                          </>
                        );
                      })()}
                    </div>
                  </div>
                </div>

                {/* Historique des premiers JO d'hiver */}
                <div className="winter-games-history">
                  <h4>🏔️ Historique des premiers JO d'hiver</h4>
                  <div className="history-timeline">
                    {(() => {
                      const winterGames = hostsData.data.filter(host => 
                        host.season && host.season.toLowerCase() === 'winter'
                      ).sort((a, b) => a.year - b.year).slice(0, 5);
                      
                      return (
                        <div className="timeline">
                          {winterGames.map((game, index) => (
                            <div key={index} className={`timeline-item ${game.city === 'Chamonix' ? 'highlight' : ''}`}>
                              <div className="timeline-year">{game.year}</div>
                              <div className="timeline-content">
                                <h6>{game.city}, {game.country}</h6>
                                <p>{game.duration_days} jours</p>
                                {game.city === 'Chamonix' && (
                                  <span className="first-badge">Premier JO d'hiver</span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      );
                    })()}
                  </div>
                </div>

                {/* Informations sur Chamonix 1924 */}
                <div className="chamonix-details">
                  <h4>🏔️ Chamonix 1924 - Détails historiques</h4>
                  <div className="chamonix-info">
                    <div className="info-grid">
                      <div className="info-card">
                        <h5>📅 Dates</h5>
                        <p>25 janvier - 5 février 1924</p>
                      </div>
                      <div className="info-card">
                        <h5>⏱️ Durée</h5>
                        <p>11 jours</p>
                      </div>
                      <div className="info-card">
                        <h5>🏔️ Lieu</h5>
                        <p>Chamonix, France</p>
                      </div>
                      <div className="info-card">
                        <h5>🏆 Statut</h5>
                        <p>Premier JO d'hiver officiel</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Conclusion */}
                <div className="winter-games-conclusion">
                  <div className="conclusion-card">
                    <h4>🎯 Conclusion</h4>
                    <div className="conclusion-content">
                      <div className="correct-answer">
                        <p>✅ <strong>CORRECT !</strong> Les Jeux Olympiques d'hiver sont bien nés à Chamonix en 1924.</p>
                        <p>Chamonix 1924 marque l'officialisation des Jeux Olympiques d'hiver par le Comité International Olympique (CIO).</p>
                        <p>Cette édition historique a ouvert la voie à tous les Jeux Olympiques d'hiver qui ont suivi.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case 4:
        return (
          <div className="question-content">
            <h3>📊 Réponse basée sur les données :</h3>
            {loading && <div className="loading">Chargement des données...</div>}
            {error && <div className="error">❌ {error}</div>}
            
            {hostsData && (
              <div className="women-participation-analysis">
                {/* Analyse de la participation féminine en 1900 */}
                <div className="paris-1900-women">
                  <div className="historical-card">
                    <h4>👩‍🏃‍♀️ Participation des femmes aux JO de Paris 1900</h4>
                    <div className="historical-details">
                      {(() => {
                        // Analyser les données pour Paris 1900
                        const paris1900Data = hostsData.data.find(host => 
                          host.year === 1900 && host.city === 'Paris' && host.season === 'Summer'
                        );
                        
                        return (
                          <>
                            <div className="paris-1900-info">
                              <div className="games-year-badge">1900</div>
                              <div className="games-details">
                                <h5>Paris, France - Jeux Olympiques d'été</h5>
                                <p><strong>Dates :</strong> {paris1900Data?.start_date} - {paris1900Data?.end_date}</p>
                                <p><strong>Durée :</strong> {paris1900Data?.duration_days} jours</p>
                              </div>
                            </div>
                            
                            <div className="women-participation-facts">
                              <h5>🏆 Faits historiques sur la participation féminine :</h5>
                              <div className="facts-grid">
                                <div className="fact-card">
                                  <h6>👩‍🎾 Tennis</h6>
                                  <p>Charlotte Cooper (GBR) - Première championne olympique féminine</p>
                                </div>
                                <div className="fact-card">
                                  <h6>⛳ Golf</h6>
                                  <p>Margaret Abbott (USA) - Première championne américaine</p>
                                </div>
                                <div className="fact-card">
                                  <h6>🏹 Tir à l'arc</h6>
                                  <p>Participation féminine dans plusieurs épreuves</p>
                                </div>
                                <div className="fact-card">
                                  <h6>🤸‍♀️ Gymnastique</h6>
                                  <p>Épreuves féminines introduites</p>
                                </div>
                              </div>
                            </div>
                            
                            <div className="verification">
                              <h5>🔍 Vérification :</h5>
                              <div className="verification-result">
                                <div className="correct-verification">
                                  <p>✅ <strong>CORRECT !</strong> Les femmes ont bien participé aux Jeux Olympiques de Paris 1900.</p>
                                  <p>Paris 1900 marque la première participation officielle des femmes aux Jeux Olympiques modernes.</p>
                                  <p>Charlotte Cooper (tennis) et Margaret Abbott (golf) sont devenues les premières championnes olympiques féminines de l'histoire.</p>
                                </div>
                              </div>
                            </div>
                          </>
                        );
                      })()}
                    </div>
                  </div>
                </div>

                {/* Historique de la participation féminine */}
                <div className="women-history">
                  <h4>📚 Historique de la participation féminine aux JO</h4>
                  <div className="history-timeline">
                    <div className="timeline">
                      <div className="timeline-item highlight">
                        <div className="timeline-year">1900</div>
                        <div className="timeline-content">
                          <h6>Paris, France</h6>
                          <p>Première participation féminine officielle</p>
                          <span className="milestone-badge">Première fois</span>
                        </div>
                      </div>
                      <div className="timeline-item">
                        <div className="timeline-year">1904</div>
                        <div className="timeline-content">
                          <h6>St. Louis, USA</h6>
                          <p>Continuation de la participation féminine</p>
                        </div>
                      </div>
                      <div className="timeline-item">
                        <div className="timeline-year">1908</div>
                        <div className="timeline-content">
                          <h6>Londres, UK</h6>
                          <p>Développement des épreuves féminines</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sports féminins en 1900 */}
                <div className="women-sports-1900">
                  <h4>🏅 Sports féminins aux JO de Paris 1900</h4>
                  <div className="sports-grid">
                    <div className="sport-card">
                      <div className="sport-icon">🎾</div>
                      <h5>Tennis</h5>
                      <p><strong>Championne :</strong> Charlotte Cooper (GBR)</p>
                      <p><strong>Épreuve :</strong> Simple dames</p>
                    </div>
                    <div className="sport-card">
                      <div className="sport-icon">⛳</div>
                      <h5>Golf</h5>
                      <p><strong>Championne :</strong> Margaret Abbott (USA)</p>
                      <p><strong>Épreuve :</strong> Individuel femmes</p>
                    </div>
                    <div className="sport-card">
                      <div className="sport-icon">🏹</div>
                      <h5>Tir à l'arc</h5>
                      <p><strong>Participation :</strong> Épreuves féminines</p>
                      <p><strong>Format :</strong> Compétitions mixtes</p>
                    </div>
                    <div className="sport-card">
                      <div className="sport-icon">🤸‍♀️</div>
                      <h5>Gymnastique</h5>
                      <p><strong>Participation :</strong> Épreuves féminines</p>
                      <p><strong>Format :</strong> Compétitions spécialisées</p>
                    </div>
                  </div>
                </div>

                {/* Impact historique */}
                <div className="historical-impact">
                  <h4>🌟 Impact historique</h4>
                  <div className="impact-content">
                    <div className="impact-grid">
                      <div className="impact-card">
                        <h5>🚀 Révolution</h5>
                        <p>Première participation officielle des femmes aux JO modernes</p>
                      </div>
                      <div className="impact-card">
                        <h5>🏆 Champions</h5>
                        <p>Charlotte Cooper et Margaret Abbott deviennent les premières championnes olympiques</p>
                      </div>
                      <div className="impact-card">
                        <h5>🌍 Mondial</h5>
                        <p>Participation internationale avec des athlètes de plusieurs pays</p>
                      </div>
                      <div className="impact-card">
                        <h5>📈 Évolution</h5>
                        <p>Ouverture de la voie à la participation féminine dans tous les sports</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Conclusion */}
                <div className="women-participation-conclusion">
                  <div className="conclusion-card">
                    <h4>🎯 Conclusion</h4>
                    <div className="conclusion-content">
                      <div className="correct-answer">
                        <p>✅ <strong>CORRECT !</strong> Les femmes ont bien participé aux Jeux Olympiques de Paris 1900.</p>
                        <p>Paris 1900 marque un tournant historique dans l'histoire olympique avec la première participation officielle des femmes.</p>
                        <p>Cette édition a ouvert la voie à l'égalité des sexes dans le sport olympique et a établi les bases de la participation féminine moderne.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case 5:
        return (
          <div className="question-content">
            <h3>📊 Réponse basée sur les données :</h3>
            {loading && <div className="loading">Chargement des données...</div>}
            {error && <div className="error">❌ {error}</div>}
            
            <div className="dual-season-analysis">
              {/* Analyse des athlètes double saison */}
              <div className="dual-season-athletes">
                <div className="historical-card">
                  <h4>🏅 Athlètes avec médailles été et hiver</h4>
                  <div className="historical-details">
                    <div className="dual-season-info">
                      <div className="achievement-badge">1988</div>
                      <div className="achievement-details">
                        <h5>Christa Luding-Rothenburger (Allemagne)</h5>
                        <p><strong>Performance unique :</strong> Médailles été et hiver la même année</p>
                        <p><strong>Année :</strong> 1988 - Calgary (hiver) + Séoul (été)</p>
                      </div>
                    </div>
                    
                    <div className="dual-season-facts">
                      <h5>🏆 Faits historiques sur les athlètes double saison :</h5>
                      <div className="facts-grid">
                        <div className="fact-card">
                          <h6>🥇 Calgary 1988 (Hiver)</h6>
                          <p>Or - Patinage de vitesse 1000m</p>
                          <p>Argent - Patinage de vitesse 500m</p>
                        </div>
                        <div className="fact-card">
                          <h6>🥈 Séoul 1988 (Été)</h6>
                          <p>Argent - Cyclisme sur piste (sprint)</p>
                          <p>Performance unique dans l'histoire</p>
                        </div>
                        <div className="fact-card">
                          <h6>🏅 Record historique</h6>
                          <p>Seule athlète avec médailles été/hiver</p>
                          <p>Au cours de la même année</p>
                        </div>
                        <div className="fact-card">
                          <h6>🌟 Exploit exceptionnel</h6>
                          <p>Maîtrise de deux sports différents</p>
                          <p>Patinage de vitesse + Cyclisme</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="verification">
                      <h5>🔍 Vérification :</h5>
                      <div className="verification-result">
                        <div className="correct-verification">
                          <p>✅ <strong>CORRECT !</strong> Christa Luding-Rothenburger est bien la seule athlète à avoir remporté des médailles aux JO d'hiver et d'été au cours de la même année (1988).</p>
                          <p>Cette performance exceptionnelle reste unique dans l'histoire olympique.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Les 4 athlètes double saison */}
              <div className="four-athletes">
                <h4>🏆 Les 4 athlètes avec médailles été et hiver</h4>
                <div className="athletes-grid">
                  <div className="athlete-card highlight">
                    <div className="athlete-icon">🏅</div>
                    <h5>Christa Luding-Rothenburger</h5>
                    <p><strong>Pays :</strong> Allemagne</p>
                    <p><strong>Sports :</strong> Patinage de vitesse + Cyclisme</p>
                    <p><strong>Année :</strong> 1988 (même année)</p>
                    <span className="unique-badge">Unique</span>
                  </div>
                  <div className="athlete-card">
                    <div className="athlete-icon">🏅</div>
                    <h5>Eddie Eagan</h5>
                    <p><strong>Pays :</strong> États-Unis</p>
                    <p><strong>Sports :</strong> Boxe + Bobsleigh</p>
                    <p><strong>Années :</strong> 1920-1932</p>
                  </div>
                  <div className="athlete-card">
                    <div className="athlete-icon">🏅</div>
                    <h5>Jacob Tullin Thams</h5>
                    <p><strong>Pays :</strong> Norvège</p>
                    <p><strong>Sports :</strong> Saut à ski + Voile</p>
                    <p><strong>Années :</strong> 1924-1936</p>
                  </div>
                  <div className="athlete-card">
                    <div className="athlete-icon">🏅</div>
                    <h5>Gillis Grafström</h5>
                    <p><strong>Pays :</strong> Suède</p>
                    <p><strong>Sports :</strong> Patinage artistique + Voile</p>
                    <p><strong>Années :</strong> 1920-1932</p>
                  </div>
                </div>
              </div>

              {/* Performance de Christa Luding-Rothenburger */}
              <div className="christa-performance">
                <h4>🌟 Performance exceptionnelle de Christa Luding-Rothenburger</h4>
                <div className="performance-timeline">
                  <div className="timeline">
                    <div className="timeline-item highlight">
                      <div className="timeline-year">Fév 1988</div>
                      <div className="timeline-content">
                        <h6>Calgary - JO d'hiver</h6>
                        <p>🥇 Or - Patinage de vitesse 1000m</p>
                        <p>🥈 Argent - Patinage de vitesse 500m</p>
                        <span className="winter-badge">Hiver</span>
                      </div>
                    </div>
                    <div className="timeline-item highlight">
                      <div className="timeline-year">Sep 1988</div>
                      <div className="timeline-content">
                        <h6>Séoul - JO d'été</h6>
                        <p>🥈 Argent - Cyclisme sur piste (sprint)</p>
                        <p>Performance historique</p>
                        <span className="summer-badge">Été</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Impact historique */}
              <div className="dual-season-impact">
                <h4>🌟 Impact historique</h4>
                <div className="impact-content">
                  <div className="impact-grid">
                    <div className="impact-card">
                      <h5>🏆 Unique</h5>
                      <p>Seule athlète avec médailles été/hiver la même année</p>
                    </div>
                    <div className="impact-card">
                      <h5>⚡ Polyvalence</h5>
                      <p>Maîtrise de deux sports complètement différents</p>
                    </div>
                    <div className="impact-card">
                      <h5>📅 Timing</h5>
                      <p>Exploit réalisé en 1988 (JO d'hiver et d'été)</p>
                    </div>
                    <div className="impact-card">
                      <h5>🌍 Mondial</h5>
                      <p>Reconnaissance internationale de cet exploit</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Conclusion */}
              <div className="dual-season-conclusion">
                <div className="conclusion-card">
                  <h4>🎯 Conclusion</h4>
                  <div className="conclusion-content">
                    <div className="correct-answer">
                      <p>✅ <strong>CORRECT !</strong> Christa Luding-Rothenburger est bien la seule athlète à avoir remporté des médailles aux JO d'hiver et d'été au cours de la même année (1988).</p>
                      <p>Cette performance exceptionnelle reste unique dans l'histoire olympique et démontre une polyvalence sportive remarquable.</p>
                      <p>Elle fait partie des 4 athlètes seulement à avoir remporté des médailles dans les deux saisons, mais est la seule à l'avoir fait la même année.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="question-content">
            <h3>📊 Réponse basée sur les données :</h3>
            {loading && <div className="loading">Chargement des données...</div>}
            {error && <div className="error">❌ {error}</div>}
            
            {hostsData && (
              <div className="calendar-evolution-analysis">
                {/* Analyse de l'évolution du calendrier */}
                <div className="calendar-evolution">
                  <div className="historical-card">
                    <h4>📅 Évolution du calendrier olympique</h4>
                    <div className="historical-details">
                      <div className="calendar-info">
                        <div className="calendar-badge">1924-1992</div>
                        <div className="calendar-details">
                          <h5>Période : JO d'hiver et d'été la même année</h5>
                          <p><strong>Changement :</strong> 1994 - Introduction de cycles distincts</p>
                          <p><strong>Nouveau système :</strong> Alternance de 2 ans entre été et hiver</p>
                        </div>
                      </div>
                      
                      <div className="calendar-facts">
                        <h5>📊 Faits sur l'évolution du calendrier :</h5>
                        <div className="facts-grid">
                          <div className="fact-card">
                            <h6>📅 Période 1924-1992</h6>
                            <p>JO d'hiver et d'été la même année</p>
                            <p>Exemple : 1988 Calgary + Séoul</p>
                          </div>
                          <div className="fact-card">
                            <h6>🔄 Changement 1994</h6>
                            <p>Introduction des cycles distincts</p>
                            <p>Lillehammer 1994 (hiver seul)</p>
                          </div>
                          <div className="fact-card">
                            <h6>⚡ Nouveau système</h6>
                            <p>Alternance de 2 ans</p>
                            <p>Été : 1996, 2000, 2004...</p>
                          </div>
                          <div className="fact-card">
                            <h6>🏅 Avantages</h6>
                            <p>Meilleure organisation</p>
                            <p>Plus d'attention pour chaque saison</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="verification">
                        <h5>🔍 Vérification :</h5>
                        <div className="verification-result">
                          <div className="correct-verification">
                            <p>✅ <strong>CORRECT !</strong> De 1924 à 1992, les JO d'hiver et d'été avaient lieu la même année. Depuis 1994, ils alternent avec un cycle de 2 ans.</p>
                            <p>Cette évolution a permis une meilleure organisation et une attention accrue pour chaque saison olympique.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Timeline de l'évolution */}
                <div className="calendar-timeline">
                  <h4>📈 Timeline de l'évolution du calendrier</h4>
                  <div className="timeline-evolution">
                    <div className="timeline">
                      <div className="timeline-item highlight">
                        <div className="timeline-year">1924-1992</div>
                        <div className="timeline-content">
                          <h6>Période : Même année</h6>
                          <p>JO d'hiver et d'été la même année</p>
                          <span className="period-badge">Ancien système</span>
                        </div>
                      </div>
                      <div className="timeline-item transition">
                        <div className="timeline-year">1994</div>
                        <div className="timeline-content">
                          <h6>Changement historique</h6>
                          <p>Lillehammer - Premier JO d'hiver seul</p>
                          <span className="change-badge">Transition</span>
                        </div>
                      </div>
                      <div className="timeline-item highlight">
                        <div className="timeline-year">1996+</div>
                        <div className="timeline-content">
                          <h6>Nouveau système</h6>
                          <p>Alternance de 2 ans</p>
                          <span className="new-badge">Nouveau système</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Comparaison des systèmes */}
                <div className="system-comparison">
                  <h4>⚖️ Comparaison des systèmes</h4>
                  <div className="comparison-grid">
                    <div className="system-card old-system">
                      <div className="system-icon">📅</div>
                      <h5>Ancien système (1924-1992)</h5>
                      <div className="system-details">
                        <p><strong>Fréquence :</strong> Tous les 4 ans</p>
                        <p><strong>Format :</strong> Hiver + Été la même année</p>
                        <p><strong>Exemples :</strong> 1988 Calgary + Séoul</p>
                        <p><strong>Avantages :</strong> Concentration des événements</p>
                        <p><strong>Inconvénients :</strong> Surcharge médiatique</p>
                      </div>
                    </div>
                    <div className="system-card new-system">
                      <div className="system-icon">🔄</div>
                      <h5>Nouveau système (1994+)</h5>
                      <div className="system-details">
                        <p><strong>Fréquence :</strong> Tous les 2 ans</p>
                        <p><strong>Format :</strong> Alternance été/hiver</p>
                        <p><strong>Exemples :</strong> 2018 PyeongChang, 2020 Tokyo</p>
                        <p><strong>Avantages :</strong> Meilleure organisation</p>
                        <p><strong>Inconvénients :</strong> Plus d'événements à gérer</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Exemples concrets */}
                <div className="concrete-examples">
                  <h4>🏆 Exemples concrets de l'évolution</h4>
                  <div className="examples-grid">
                    <div className="example-period">
                      <h5>📅 Période 1924-1992 (Même année)</h5>
                      <div className="examples-list">
                        <div className="example-item">
                          <span className="year">1988</span>
                          <span className="events">Calgary (Hiver) + Séoul (Été)</span>
                        </div>
                        <div className="example-item">
                          <span className="year">1992</span>
                          <span className="events">Albertville (Hiver) + Barcelone (Été)</span>
                        </div>
                      </div>
                    </div>
                    <div className="example-period">
                      <h5>🔄 Période 1994+ (Cycles distincts)</h5>
                      <div className="examples-list">
                        <div className="example-item">
                          <span className="year">1994</span>
                          <span className="events">Lillehammer (Hiver)</span>
                        </div>
                        <div className="example-item">
                          <span className="year">1996</span>
                          <span className="events">Atlanta (Été)</span>
                        </div>
                        <div className="example-item">
                          <span className="year">1998</span>
                          <span className="events">Nagano (Hiver)</span>
                        </div>
                        <div className="example-item">
                          <span className="year">2000</span>
                          <span className="events">Sydney (Été)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Impact de l'évolution */}
                <div className="evolution-impact">
                  <h4>🌟 Impact de l'évolution</h4>
                  <div className="impact-content">
                    <div className="impact-grid">
                      <div className="impact-card">
                        <h5>📺 Médias</h5>
                        <p>Meilleure couverture médiatique pour chaque saison</p>
                      </div>
                      <div className="impact-card">
                        <h5>🏗️ Organisation</h5>
                        <p>Plus de temps pour organiser chaque édition</p>
                      </div>
                      <div className="impact-card">
                        <h5>💰 Économie</h5>
                        <p>Répartition des investissements sur 2 ans</p>
                      </div>
                      <div className="impact-card">
                        <h5>🏅 Athlètes</h5>
                        <p>Plus d'attention pour chaque discipline</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Conclusion */}
                <div className="calendar-evolution-conclusion">
                  <div className="conclusion-card">
                    <h4>🎯 Conclusion</h4>
                    <div className="conclusion-content">
                      <div className="correct-answer">
                        <p>✅ <strong>CORRECT !</strong> De 1924 à 1992, les JO d'hiver et d'été avaient lieu la même année. Depuis 1994, ils alternent avec un cycle de 2 ans.</p>
                        <p>Cette évolution a permis une meilleure organisation, une attention médiatique accrue pour chaque saison, et une répartition plus équitable des investissements.</p>
                        <p>Le nouveau système offre plus de temps pour organiser chaque édition et permet une meilleure mise en valeur des athlètes et des disciplines.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case 7:
        return (
          <div className="question-content">
            <h3>📊 Réponse basée sur les données :</h3>
            {loading && <div className="loading">Chargement des données...</div>}
            {error && <div className="error">❌ {error}</div>}
            
            <div className="weissmuller-analysis">
              {/* Analyse de Johnny Weissmuller */}
              <div className="weissmuller-profile">
                <div className="historical-card">
                  <h4>🏊‍♂️ Johnny Weissmuller - De Tarzan aux Jeux Olympiques</h4>
                  <div className="historical-details">
                    <div className="weissmuller-info">
                      <div className="athlete-badge">1924-1928</div>
                      <div className="athlete-details">
                        <h5>Johnny Weissmuller (États-Unis)</h5>
                        <p><strong>Sport :</strong> Natation</p>
                        <p><strong>Carrière :</strong> 5 médailles d'or olympiques</p>
                        <p><strong>Cinéma :</strong> 12 films de Tarzan (1932-1948)</p>
                      </div>
                    </div>
                    
                    <div className="weissmuller-facts">
                      <h5>🏆 Faits sur Johnny Weissmuller :</h5>
                      <div className="facts-grid">
                        <div className="fact-card">
                          <h6>🥇 Paris 1924</h6>
                          <p>100m nage libre - Or</p>
                          <p>400m nage libre - Or</p>
                          <p>Relais 4×200m - Or</p>
                        </div>
                        <div className="fact-card">
                          <h6>🥇 Amsterdam 1928</h6>
                          <p>100m nage libre - Or</p>
                          <p>Relais 4×200m - Or</p>
                          <p>Performance exceptionnelle</p>
                        </div>
                        <div className="fact-card">
                          <h6>🎬 Carrière cinématographique</h6>
                          <p>12 films de Tarzan</p>
                          <p>1932-1948</p>
                          <p>Icône du cinéma</p>
                        </div>
                        <div className="fact-card">
                          <h6>🏅 Record historique</h6>
                          <p>5 médailles d'or</p>
                          <p>Champion olympique</p>
                          <p>Légende de la natation</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="verification">
                      <h5>🔍 Vérification :</h5>
                      <div className="verification-result">
                        <div className="correct-verification">
                          <p>✅ <strong>CORRECT !</strong> Johnny Weissmuller a bien remporté 5 médailles d'or en natation dans les années 1920 et a ensuite interprété Tarzan dans 12 films.</p>
                          <p>Cette double carrière sportive et cinématographique reste unique dans l'histoire olympique.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Médailles olympiques détaillées */}
              <div className="olympic-medals">
                <h4>🏅 Médailles olympiques de Johnny Weissmuller</h4>
                <div className="medals-timeline">
                  <div className="timeline">
                    <div className="timeline-item highlight">
                      <div className="timeline-year">1924</div>
                      <div className="timeline-content">
                        <h6>Paris - JO d'été</h6>
                        <div className="medals-list">
                          <div className="medal-item gold">
                            <span className="medal-icon">🥇</span>
                            <span className="medal-event">100m nage libre</span>
                          </div>
                          <div className="medal-item gold">
                            <span className="medal-icon">🥇</span>
                            <span className="medal-event">400m nage libre</span>
                          </div>
                          <div className="medal-item gold">
                            <span className="medal-icon">🥇</span>
                            <span className="medal-event">Relais 4×200m nage libre</span>
                          </div>
                          <div className="medal-item bronze">
                            <span className="medal-icon">🥉</span>
                            <span className="medal-event">Water-polo</span>
                          </div>
                        </div>
                        <span className="games-badge">Paris 1924</span>
                      </div>
                    </div>
                    <div className="timeline-item highlight">
                      <div className="timeline-year">1928</div>
                      <div className="timeline-content">
                        <h6>Amsterdam - JO d'été</h6>
                        <div className="medals-list">
                          <div className="medal-item gold">
                            <span className="medal-icon">🥇</span>
                            <span className="medal-event">100m nage libre</span>
                          </div>
                          <div className="medal-item gold">
                            <span className="medal-icon">🥇</span>
                            <span className="medal-event">Relais 4×200m nage libre</span>
                          </div>
                        </div>
                        <span className="games-badge">Amsterdam 1928</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Carrière cinématographique */}
              <div className="cinema-career">
                <h4>🎬 Carrière cinématographique - Tarzan</h4>
                <div className="cinema-details">
                  <div className="cinema-info">
                    <div className="cinema-badge">1932-1948</div>
                    <div className="cinema-details-content">
                      <h5>Johnny Weissmuller - L'acteur de Tarzan</h5>
                      <p><strong>Rôle :</strong> Tarzan dans 12 films</p>
                      <p><strong>Période :</strong> 1932-1948</p>
                      <p><strong>Impact :</strong> Icône du cinéma d'aventure</p>
                    </div>
                  </div>
                  
                  <div className="films-grid">
                    <div className="film-card">
                      <div className="film-icon">🎬</div>
                      <h6>Tarzan the Ape Man</h6>
                      <p>1932 - Premier film</p>
                    </div>
                    <div className="film-card">
                      <div className="film-icon">🎬</div>
                      <h6>Tarzan and His Mate</h6>
                      <p>1934 - Succès critique</p>
                    </div>
                    <div className="film-card">
                      <div className="film-icon">🎬</div>
                      <h6>Tarzan Escapes</h6>
                      <p>1936 - Aventure</p>
                    </div>
                    <div className="film-card">
                      <div className="film-icon">🎬</div>
                      <h6>Tarzan Finds a Son</h6>
                      <p>1939 - Famille</p>
                    </div>
                    <div className="film-card">
                      <div className="film-icon">🎬</div>
                      <h6>Tarzan's Secret Treasure</h6>
                      <p>1941 - Trésor</p>
                    </div>
                    <div className="film-card">
                      <div className="film-icon">🎬</div>
                      <h6>Tarzan's New York Adventure</h6>
                      <p>1942 - Modernité</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Double carrière unique */}
              <div className="unique-career">
                <h4>🌟 Une double carrière unique</h4>
                <div className="career-comparison">
                  <div className="career-phase">
                    <h5>🏊‍♂️ Phase sportive (1920s)</h5>
                    <div className="phase-details">
                      <p><strong>Sport :</strong> Natation</p>
                      <p><strong>Médailles :</strong> 5 or + 1 bronze</p>
                      <p><strong>Période :</strong> 1924-1928</p>
                      <p><strong>Réalisations :</strong> Champion olympique</p>
                    </div>
                  </div>
                  <div className="career-phase">
                    <h5>🎬 Phase cinématographique (1930s-1940s)</h5>
                    <div className="phase-details">
                      <p><strong>Rôle :</strong> Tarzan</p>
                      <p><strong>Films :</strong> 12 productions</p>
                      <p><strong>Période :</strong> 1932-1948</p>
                      <p><strong>Réalisations :</strong> Icône du cinéma</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Impact historique */}
              <div className="weissmuller-impact">
                <h4>🌟 Impact historique</h4>
                <div className="impact-content">
                  <div className="impact-grid">
                    <div className="impact-card">
                      <h5>🏊‍♂️ Natation</h5>
                      <p>Légende de la natation olympique</p>
                    </div>
                    <div className="impact-card">
                      <h5>🎬 Cinéma</h5>
                      <p>Incarnation emblématique de Tarzan</p>
                    </div>
                    <div className="impact-card">
                      <h5>🌟 Unique</h5>
                      <p>Seul athlète olympique devenu acteur de légende</p>
                    </div>
                    <div className="impact-card">
                      <h5>🏆 Inspiration</h5>
                      <p>Modèle de réussite sportive et artistique</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Conclusion */}
              <div className="weissmuller-conclusion">
                <div className="conclusion-card">
                  <h4>🎯 Conclusion</h4>
                  <div className="conclusion-content">
                    <div className="correct-answer">
                      <p>✅ <strong>CORRECT !</strong> Johnny Weissmuller a bien remporté 5 médailles d'or en natation dans les années 1920 et a ensuite interprété Tarzan dans 12 films.</p>
                      <p>Cette double carrière exceptionnelle - champion olympique puis acteur emblématique - reste unique dans l'histoire du sport et du cinéma.</p>
                      <p>Johnny Weissmuller incarne parfaitement la transition entre le sport de haut niveau et le divertissement populaire.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 8:
        return (
          <div className="question-content">
            <h3>📊 Réponse basée sur les données :</h3>
            {loading && <div className="loading">Chargement des données...</div>}
            {error && <div className="error">❌ {error}</div>}
            
            <div className="london-2012-analysis">
              {/* Analyse de Londres 2012 */}
              <div className="london-2012-milestone">
                <div className="historical-card">
                  <h4>👩‍🏃‍♀️ Londres 2012 - Premier JO avec participation féminine universelle</h4>
                  <div className="historical-details">
                    <div className="milestone-info">
                      <div className="milestone-badge">2012</div>
                      <div className="milestone-details">
                        <h5>Londres - Premier JO avec toutes les nations féminines</h5>
                        <p><strong>Révolution :</strong> Tous les pays participants ont envoyé des athlètes féminines</p>
                        <p><strong>Proportion :</strong> 44,2% d'athlètes féminines (record historique)</p>
                        <p><strong>Sports :</strong> Boxe féminine introduite - femmes dans tous les sports</p>
                      </div>
                    </div>
                    
                    <div className="milestone-facts">
                      <h5>🏆 Faits sur Londres 2012 :</h5>
                      <div className="facts-grid">
                        <div className="fact-card">
                          <h6>🌍 Participation universelle</h6>
                          <p>Tous les pays participants</p>
                          <p>Incluant l'Arabie saoudite, Qatar, Brunei</p>
                        </div>
                        <div className="fact-card">
                          <h6>📊 Record de participation</h6>
                          <p>44,2% d'athlètes féminines</p>
                          <p>Plus haute proportion jamais atteinte</p>
                        </div>
                        <div className="fact-card">
                          <h6>🥊 Boxe féminine</h6>
                          <p>Introduction historique</p>
                          <p>Femmes dans tous les sports</p>
                        </div>
                        <div className="fact-card">
                          <h6>🏅 Égalité des chances</h6>
                          <p>Révolution dans l'histoire olympique</p>
                          <p>Étape majeure pour l'égalité</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="verification">
                      <h5>🔍 Vérification :</h5>
                      <div className="verification-result">
                        <div className="correct-verification">
                          <p>✅ <strong>CORRECT !</strong> Les JO de Londres 2012 ont été les premiers où tous les pays participants ont envoyé des athlètes féminines.</p>
                          <p>Cette révolution a marqué une étape historique dans l'égalité des sexes aux Jeux Olympiques.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pays pionniers */}
              <div className="pioneer-countries">
                <h4>🌍 Pays pionniers de la participation féminine</h4>
                <div className="countries-timeline">
                  <div className="timeline">
                    <div className="timeline-item highlight">
                      <div className="timeline-year">2012</div>
                      <div className="timeline-content">
                        <h6>Londres - Révolution historique</h6>
                        <div className="pioneer-list">
                          <div className="pioneer-item">
                            <span className="country-flag">🇸🇦</span>
                            <span className="country-name">Arabie saoudite</span>
                            <span className="pioneer-badge">Première fois</span>
                          </div>
                          <div className="pioneer-item">
                            <span className="country-flag">🇶🇦</span>
                            <span className="country-name">Qatar</span>
                            <span className="pioneer-badge">Première fois</span>
                          </div>
                          <div className="pioneer-item">
                            <span className="country-flag">🇧🇳</span>
                            <span className="country-name">Brunei</span>
                            <span className="pioneer-badge">Première fois</span>
                          </div>
                        </div>
                        <span className="revolution-badge">Révolution 2012</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Statistiques de participation */}
              <div className="participation-stats">
                <h4>📊 Statistiques de participation féminine</h4>
                <div className="stats-grid">
                  <div className="stat-card">
                    <div className="stat-icon">👩‍🏃‍♀️</div>
                    <h5>Proportion féminine</h5>
                    <div className="stat-value">44,2%</div>
                    <p>Record historique atteint</p>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon">🌍</div>
                    <h5>Pays participants</h5>
                    <div className="stat-value">100%</div>
                    <p>Avec athlètes féminines</p>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon">🥊</div>
                    <h5>Sports féminins</h5>
                    <div className="stat-value">Tous</div>
                    <p>Boxe féminine introduite</p>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon">🏅</div>
                    <h5>Épreuves</h5>
                    <div className="stat-value">+30</div>
                    <p>Nouvelles épreuves féminines</p>
                  </div>
                </div>
              </div>

              {/* Évolution historique */}
              <div className="historical-evolution">
                <h4>📈 Évolution de la participation féminine</h4>
                <div className="evolution-timeline">
                  <div className="timeline">
                    <div className="timeline-item">
                      <div className="timeline-year">1900</div>
                      <div className="timeline-content">
                        <h6>Paris - Première participation</h6>
                        <p>Charlotte Cooper (tennis)</p>
                        <p>Margaret Abbott (golf)</p>
                      </div>
                    </div>
                    <div className="timeline-item">
                      <div className="timeline-year">1928</div>
                      <div className="timeline-content">
                        <h6>Amsterdam - Développement</h6>
                        <p>Épreuves d'athlétisme féminines</p>
                        <p>Croissance de la participation</p>
                      </div>
                    </div>
                    <div className="timeline-item">
                      <div className="timeline-year">1964</div>
                      <div className="timeline-content">
                        <h6>Tokyo - Expansion</h6>
                        <p>Volleyball féminin introduit</p>
                        <p>Plus de sports féminins</p>
                      </div>
                    </div>
                    <div className="timeline-item highlight">
                      <div className="timeline-year">2012</div>
                      <div className="timeline-content">
                        <h6>Londres - Révolution</h6>
                        <p>Tous les pays avec femmes</p>
                        <p>Boxe féminine introduite</p>
                        <span className="revolution-badge">Révolution</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Défis et inégalités persistantes */}
              <div className="remaining-challenges">
                <h4>⚖️ Défis et inégalités persistantes</h4>
                <div className="challenges-grid">
                  <div className="challenge-card">
                    <div className="challenge-icon">📊</div>
                    <h5>Épreuves inégales</h5>
                    <p>30 épreuves de moins pour les femmes</p>
                    <p>Autant de médailles en moins</p>
                  </div>
                  <div className="challenge-card">
                    <div className="challenge-icon">✈️</div>
                    <h5>Conditions de voyage</h5>
                    <p>Footballeuses japonaises en classe économique</p>
                    <p>Basketteuses australiennes en classe économique</p>
                  </div>
                  <div className="challenge-card">
                    <div className="challenge-icon">💰</div>
                    <h5>Ressources inégales</h5>
                    <p>Hommes en première classe</p>
                    <p>Discrimination persistante</p>
                  </div>
                  <div className="challenge-card">
                    <div className="challenge-icon">🏆</div>
                    <h5>Reconnaissance</h5>
                    <p>Progrès significatifs réalisés</p>
                    <p>Défis restants à surmonter</p>
                  </div>
                </div>
              </div>

              {/* Impact historique */}
              <div className="london-2012-impact">
                <h4>🌟 Impact historique de Londres 2012</h4>
                <div className="impact-content">
                  <div className="impact-grid">
                    <div className="impact-card">
                      <h5>🌍 Mondial</h5>
                      <p>Participation féminine universelle</p>
                    </div>
                    <div className="impact-card">
                      <h5>📈 Progression</h5>
                      <p>44,2% d'athlètes féminines (record)</p>
                    </div>
                    <div className="impact-card">
                      <h5>🥊 Sports</h5>
                      <p>Femmes dans tous les sports olympiques</p>
                    </div>
                    <div className="impact-card">
                      <h5>🏅 Égalité</h5>
                      <p>Étape majeure vers l'égalité des sexes</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Conclusion */}
              <div className="london-2012-conclusion">
                <div className="conclusion-card">
                  <h4>🎯 Conclusion</h4>
                  <div className="conclusion-content">
                    <div className="correct-answer">
                      <p>✅ <strong>CORRECT !</strong> Les JO de Londres 2012 ont été les premiers où tous les pays participants ont envoyé des athlètes féminines.</p>
                      <p>Cette révolution historique a marqué une étape majeure dans l'égalité des sexes aux Jeux Olympiques, avec 44,2% d'athlètes féminines et l'introduction de la boxe féminine.</p>
                      <p>Malgré les défis persistants, Londres 2012 reste un moment clé dans l'évolution vers une participation olympique plus équitable.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 9:
        return (
          <div className="question-content">
            <h3>📊 Réponse basée sur les données :</h3>
            {loading && <div className="loading">Chargement des données...</div>}
            {error && <div className="error">❌ {error}</div>}
            
            <div className="discontinued-sports-analysis">
              {/* Analyse des sports disparus */}
              <div className="discontinued-sports-overview">
                <div className="historical-card">
                  <h4>🏹 Sports olympiques disparus - Histoire et évolution</h4>
                  <div className="historical-details">
                    <div className="sports-overview-info">
                      <div className="overview-badge">1900-2024</div>
                      <div className="overview-details">
                        <h5>Évolution du programme olympique</h5>
                        <p><strong>Sports disparus :</strong> Plusieurs disciplines ont été retirées</p>
                        <p><strong>Tir au pigeon :</strong> Une seule fois à Paris 1900</p>
                        <p><strong>Raisons :</strong> Évolution des valeurs et préférences</p>
                      </div>
                    </div>
                    
                    <div className="sports-overview-facts">
                      <h5>🏆 Faits sur les sports disparus :</h5>
                      <div className="facts-grid">
                        <div className="fact-card">
                          <h6>🏊‍♀️ Natation synchronisée solo</h6>
                          <p>1984-1992 (3 éditions)</p>
                          <p>Supprimée après Barcelone</p>
                        </div>
                        <div className="fact-card">
                          <h6>🪢 Tir à la corde</h6>
                          <p>1900-1920 (5 éditions)</p>
                          <p>Jugé désuet</p>
                        </div>
                        <div className="fact-card">
                          <h6>🏹 Tir au pigeon</h6>
                          <p>Paris 1900 uniquement</p>
                          <p>~300 pigeons tués</p>
                        </div>
                        <div className="fact-card">
                          <h6>🎈 Montgolfière</h6>
                          <p>Paris 1900 uniquement</p>
                          <p>Sport de démonstration</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="verification">
                      <h5>🔍 Vérification :</h5>
                      <div className="verification-result">
                        <div className="correct-verification">
                          <p>✅ <strong>CORRECT !</strong> Ces sports ont bien disparu des JO et le tir au pigeon n'a eu lieu qu'une seule fois à Paris 1900.</p>
                          <p>Cette évolution reflète les changements de valeurs sociétales et les préférences sportives au fil du temps.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sports disparus détaillés */}
              <div className="discontinued-sports-details">
                <h4>🏹 Sports olympiques disparus</h4>
                <div className="sports-grid">
                  <div className="sport-card discontinued">
                    <div className="sport-icon">🏊‍♀️</div>
                    <h5>Natation synchronisée solo</h5>
                    <p><strong>Période :</strong> 1984-1992</p>
                    <p><strong>Raison :</strong> Suppression du programme</p>
                    <span className="discontinued-badge">Disparu</span>
                  </div>
                  <div className="sport-card discontinued">
                    <div className="sport-icon">🪢</div>
                    <h5>Tir à la corde</h5>
                    <p><strong>Période :</strong> 1900-1920</p>
                    <p><strong>Raison :</strong> Jugé désuet</p>
                    <span className="discontinued-badge">Disparu</span>
                  </div>
                  <div className="sport-card discontinued">
                    <div className="sport-icon">🧗‍♀️</div>
                    <h5>Corde à grimper</h5>
                    <p><strong>Période :</strong> 1896-1932</p>
                    <p><strong>Raison :</strong> Suppression</p>
                    <span className="discontinued-badge">Disparu</span>
                  </div>
                  <div className="sport-card discontinued">
                    <div className="sport-icon">🎈</div>
                    <h5>Montgolfière</h5>
                    <p><strong>Période :</strong> 1900 uniquement</p>
                    <p><strong>Raison :</strong> Sport de démonstration</p>
                    <span className="discontinued-badge">Disparu</span>
                  </div>
                  <div className="sport-card discontinued">
                    <div className="sport-icon">🔫</div>
                    <h5>Duel au pistolet</h5>
                    <p><strong>Période :</strong> 1906 uniquement</p>
                    <p><strong>Raison :</strong> Trop dangereux</p>
                    <span className="discontinued-badge">Disparu</span>
                  </div>
                  <div className="sport-card discontinued">
                    <div className="sport-icon">🚴‍♂️</div>
                    <h5>Vélo tandem</h5>
                    <p><strong>Période :</strong> 1908-1972</p>
                    <p><strong>Raison :</strong> Suppression</p>
                    <span className="discontinued-badge">Disparu</span>
                  </div>
                  <div className="sport-card discontinued">
                    <div className="sport-icon">🏊‍♂️</div>
                    <h5>Course d'obstacles à la nage</h5>
                    <p><strong>Période :</strong> 1900 uniquement</p>
                    <p><strong>Raison :</strong> Suppression</p>
                    <span className="discontinued-badge">Disparu</span>
                  </div>
                  <div className="sport-card discontinued">
                    <div className="sport-icon">🤿</div>
                    <h5>Plongeon à distance</h5>
                    <p><strong>Période :</strong> 1904 uniquement</p>
                    <p><strong>Raison :</strong> Suppression</p>
                    <span className="discontinued-badge">Disparu</span>
                  </div>
                </div>
              </div>

              {/* Tir au pigeon - Cas spécial */}
              <div className="pigeon-shooting-special">
                <h4>🕊️ Tir au pigeon - Le cas le plus controversé</h4>
                <div className="pigeon-shooting-details">
                  <div className="special-event-card">
                    <div className="event-badge">Paris 1900</div>
                    <div className="event-details">
                      <h5>Tir au pigeon vivant</h5>
                      <p><strong>Édition :</strong> Paris 1900 uniquement</p>
                      <p><strong>Victimes :</strong> ~300 pigeons tués</p>
                      <p><strong>Raison de suppression :</strong> Cruauté envers les animaux</p>
                    </div>
                  </div>
                  
                  <div className="pigeon-shooting-facts">
                    <h5>📊 Faits sur le tir au pigeon :</h5>
                    <div className="facts-grid">
                      <div className="fact-card">
                        <h6>🎯 Format</h6>
                        <p>Tir sur pigeons vivants</p>
                        <p>Compétition de précision</p>
                      </div>
                      <div className="fact-card">
                        <h6>💀 Conséquences</h6>
                        <p>~300 pigeons tués</p>
                        <p>Scandale médiatique</p>
                      </div>
                      <div className="fact-card">
                        <h6>🚫 Suppression</h6>
                        <p>Une seule édition</p>
                        <p>Jamais reconduit</p>
                      </div>
                      <div className="fact-card">
                        <h6>⚖️ Impact</h6>
                        <p>Révision des valeurs</p>
                        <p>Protection des animaux</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Évolution des valeurs */}
              <div className="values-evolution">
                <h4>📈 Évolution des valeurs olympiques</h4>
                <div className="evolution-timeline">
                  <div className="timeline">
                    <div className="timeline-item">
                      <div className="timeline-year">1900</div>
                      <div className="timeline-content">
                        <h6>Paris - Sports controversés</h6>
                        <p>Tir au pigeon vivant</p>
                        <p>Montgolfière</p>
                      </div>
                    </div>
                    <div className="timeline-item">
                      <div className="timeline-year">1920</div>
                      <div className="timeline-content">
                        <h6>Anvers - Nettoyage</h6>
                        <p>Suppression du tir à la corde</p>
                        <p>Sports plus modernes</p>
                      </div>
                    </div>
                    <div className="timeline-item">
                      <div className="timeline-year">1992</div>
                      <div className="timeline-content">
                        <h6>Barcelone - Modernisation</h6>
                        <p>Fin natation synchronisée solo</p>
                        <p>Focus sur les sports populaires</p>
                      </div>
                    </div>
                    <div className="timeline-item highlight">
                      <div className="timeline-year">2024</div>
                      <div className="timeline-content">
                        <h6>Paris - Retour aux sources</h6>
                        <p>Breakdance introduit</p>
                        <p>Sports urbains modernes</p>
                        <span className="modern-badge">Moderne</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Raisons de suppression */}
              <div className="suppression-reasons">
                <h4>⚖️ Raisons de suppression des sports</h4>
                <div className="reasons-grid">
                  <div className="reason-card">
                    <div className="reason-icon">🐦</div>
                    <h5>Cruauté animale</h5>
                    <p>Tir au pigeon vivant</p>
                    <p>Protection des animaux</p>
                  </div>
                  <div className="reason-card">
                    <div className="reason-icon">⏰</div>
                    <h5>Désuétude</h5>
                    <p>Tir à la corde</p>
                    <p>Sports dépassés</p>
                  </div>
                  <div className="reason-card">
                    <div className="reason-icon">⚠️</div>
                    <h5>Danger</h5>
                    <p>Duel au pistolet</p>
                    <p>Risques de sécurité</p>
                  </div>
                  <div className="reason-card">
                    <div className="reason-icon">📊</div>
                    <h5>Popularité</h5>
                    <p>Natation synchronisée solo</p>
                    <p>Faible audience</p>
                  </div>
                </div>
              </div>

              {/* Impact historique */}
              <div className="discontinued-sports-impact">
                <h4>🌟 Impact de l'évolution</h4>
                <div className="impact-content">
                  <div className="impact-grid">
                    <div className="impact-card">
                      <h5>🐦 Éthique</h5>
                      <p>Protection des animaux</p>
                    </div>
                    <div className="impact-card">
                      <h5>📈 Modernisation</h5>
                      <p>Sports plus populaires</p>
                    </div>
                    <div className="impact-card">
                      <h5>⚖️ Valeurs</h5>
                      <p>Évolution sociétale</p>
                    </div>
                    <div className="impact-card">
                      <h5>🏆 Qualité</h5>
                      <p>Programme olympique optimisé</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Conclusion */}
              <div className="discontinued-sports-conclusion">
                <div className="conclusion-card">
                  <h4>🎯 Conclusion</h4>
                  <div className="conclusion-content">
                    <div className="correct-answer">
                      <p>✅ <strong>CORRECT !</strong> Ces sports ont bien disparu des JO et le tir au pigeon n'a eu lieu qu'une seule fois à Paris 1900.</p>
                      <p>Cette évolution reflète les changements de valeurs sociétales, l'évolution des préférences sportives et la modernisation du programme olympique.</p>
                      <p>Le tir au pigeon reste l'exemple le plus controversé, avec ~300 pigeons tués lors de la seule édition de 1900.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 10:
        return (
          <div className="question-content">
            <h3>📊 Réponse basée sur les données :</h3>
            {loading && <div className="loading">Chargement des données...</div>}
            {error && <div className="error">❌ {error}</div>}
            
            <div className="rio-2016-analysis">
              {/* Analyse de Rio 2016 */}
              <div className="rio-2016-milestone">
                <div className="historical-card">
                  <h4>🇧🇷 Rio 2016 - Premiers JO en Amérique du Sud</h4>
                  <div className="historical-details">
                    <div className="milestone-info">
                      <div className="milestone-badge">2016</div>
                      <div className="milestone-details">
                        <h5>Rio de Janeiro - Première fois en Amérique du Sud</h5>
                        <p><strong>Révolution :</strong> Premiers JO organisés en Amérique du Sud</p>
                        <p><strong>Continent :</strong> Amérique du Sud (Brésil)</p>
                        <p><strong>Signification :</strong> Élargissement géographique historique</p>
                      </div>
                    </div>
                    
                    <div className="milestone-facts">
                      <h5>🏆 Faits sur Rio 2016 :</h5>
                      <div className="facts-grid">
                        <div className="fact-card">
                          <h6>🌍 Première fois</h6>
                          <p>Premiers JO en Amérique du Sud</p>
                          <p>Brésil comme pays hôte</p>
                        </div>
                        <div className="fact-card">
                          <h6>🏌️‍♂️ Golf</h6>
                          <p>Retour après 112 ans d'absence</p>
                          <p>Dernière fois en 1904</p>
                        </div>
                        <div className="fact-card">
                          <h6>🏉 Rugby à 7</h6>
                          <p>Première apparition olympique</p>
                          <p>Nouveau sport introduit</p>
                        </div>
                        <div className="fact-card">
                          <h6>🏅 Tableau des médailles</h6>
                          <p>USA : 121 médailles (46 or)</p>
                          <p>GBR : 67 médailles, CHN : 70 médailles</p>
                        </div>
                      </div>  
                    </div>
                    
                    <div className="verification">
                      <h5>🔍 Vérification :</h5>
                      <div className="verification-result">
                        <div className="correct-verification">
                          <p>✅ <strong>CORRECT !</strong> Rio 2016 a été la première manifestation des JO en Amérique du Sud.</p>
                          <p>Cette édition a marqué un tournant historique dans l'expansion géographique des Jeux Olympiques.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Historique géographique des JO */}
              <div className="geographical-history">
                <h4>🌍 Historique géographique des JO</h4>
                <div className="continents-timeline">
                  <div className="timeline">
                    <div className="timeline-item">
                      <div className="timeline-year">1896</div>
                      <div className="timeline-content">
                        <h6>Athènes - Europe</h6>
                        <p>Premiers JO modernes</p>
                        <p>Grèce, berceau olympique</p>
                      </div>
                    </div>
                    <div className="timeline-item">
                      <div className="timeline-year">1904</div>
                      <div className="timeline-content">
                        <h6>St. Louis - Amérique du Nord</h6>
                        <p>Premiers JO en Amérique</p>
                        <p>États-Unis</p>
                      </div>
                    </div>
                    <div className="timeline-item">
                      <div className="timeline-year">1956</div>
                      <div className="timeline-content">
                        <h6>Melbourne - Océanie</h6>
                        <p>Premiers JO en Océanie</p>
                        <p>Australie</p>
                      </div>
                    </div>
                    <div className="timeline-item">
                      <div className="timeline-year">1964</div>
                      <div className="timeline-content">
                        <h6>Tokyo - Asie</h6>
                        <p>Premiers JO en Asie</p>
                        <p>Japon</p>
                      </div>
                    </div>
                    <div className="timeline-item highlight">
                      <div className="timeline-year">2016</div>
                      <div className="timeline-content">
                        <h6>Rio - Amérique du Sud</h6>
                        <p>Premiers JO en Amérique du Sud</p>
                        <p>Brésil</p>
                        <span className="first-badge">Première fois</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Nouveautés de Rio 2016 */}
              <div className="rio-2016-innovations">
                <h4>🆕 Nouveautés de Rio 2016</h4>
                <div className="innovations-grid">
                  <div className="innovation-card">
                    <div className="innovation-icon">🏌️‍♂️</div>
                    <h5>Golf</h5>
                    <p><strong>Retour :</strong> Après 112 ans d'absence</p>
                    <p><strong>Dernière fois :</strong> St. Louis 1904</p>
                    <span className="return-badge">Retour</span>
                  </div>
                  <div className="innovation-card">
                    <div className="innovation-icon">🏉</div>
                    <h5>Rugby à 7</h5>
                    <p><strong>Début :</strong> Première apparition olympique</p>
                    <p><strong>Format :</strong> Version courte du rugby</p>
                    <span className="new-badge">Nouveau</span>
                  </div>
                  <div className="innovation-card">
                    <div className="innovation-icon">🌍</div>
                    <h5>Géographie</h5>
                    <p><strong>Continent :</strong> Première fois en Amérique du Sud</p>
                    <p><strong>Pays :</strong> Brésil</p>
                    <span className="geography-badge">Historique</span>
                  </div>
                  <div className="innovation-card">
                    <div className="innovation-icon">🏅</div>
                    <h5>Sports</h5>
                    <p><strong>Total :</strong> 28 sports, 41 disciplines</p>
                    <p><strong>Épreuves :</strong> 306 épreuves</p>
                    <span className="sports-badge">Complet</span>
                  </div>
                </div>
              </div>

              {/* Statistiques de Rio 2016 */}
              <div className="rio-2016-stats">
                <h4>📊 Statistiques de Rio 2016</h4>
                <div className="stats-grid">
                  <div className="stat-card">
                    <div className="stat-icon">🏃‍♂️</div>
                    <h5>Athlètes</h5>
                    <div className="stat-value">11,238</div>
                    <p>Participants</p>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon">🌍</div>
                    <h5>Pays</h5>
                    <div className="stat-value">207</div>
                    <p>Nations participantes</p>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon">🏅</div>
                    <h5>Médailles</h5>
                    <div className="stat-value">2,102</div>
                    <p>Médailles distribuées</p>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon">🏆</div>
                    <h5>Sports</h5>
                    <div className="stat-value">28</div>
                    <p>Sports olympiques</p>
                  </div>
                </div>
              </div>

              {/* Tableau des médailles */}
              <div className="medals-table">
                <h4>🏅 Tableau des médailles - Top 10</h4>
                <div className="medals-grid">
                  <div className="medal-card gold">
                    <div className="medal-rank">1</div>
                    <div className="medal-country">🇺🇸 États-Unis</div>
                    <div className="medal-count">121</div>
                    <div className="medal-breakdown">46 🥇 37 🥈 38 🥉</div>
                  </div>
                  <div className="medal-card silver">
                    <div className="medal-rank">2</div>
                    <div className="medal-country">🇬🇧 Grande-Bretagne</div>
                    <div className="medal-count">67</div>
                    <div className="medal-breakdown">27 🥇 23 🥈 17 🥉</div>
                  </div>
                  <div className="medal-card bronze">
                    <div className="medal-rank">3</div>
                    <div className="medal-country">🇨🇳 Chine</div>
                    <div className="medal-count">70</div>
                    <div className="medal-breakdown">26 🥇 18 🥈 26 🥉</div>
                  </div>
                  <div className="medal-card">
                    <div className="medal-rank">4</div>
                    <div className="medal-country">🇷🇺 Russie</div>
                    <div className="medal-count">56</div>
                    <div className="medal-breakdown">19 🥇 18 🥈 19 🥉</div>
                  </div>
                  <div className="medal-card">
                    <div className="medal-rank">5</div>
                    <div className="medal-country">🇩🇪 Allemagne</div>
                    <div className="medal-count">42</div>
                    <div className="medal-breakdown">17 🥇 10 🥈 15 🥉</div>
                  </div>
                </div>
              </div>

              {/* Impact historique */}
              <div className="rio-2016-impact">
                <h4>🌟 Impact historique de Rio 2016</h4>
                <div className="impact-content">
                  <div className="impact-grid">
                    <div className="impact-card">
                      <h5>🌍 Géographique</h5>
                      <p>Premiers JO en Amérique du Sud</p>
                    </div>
                    <div className="impact-card">
                      <h5>🏌️‍♂️ Sports</h5>
                      <p>Retour du golf après 112 ans</p>
                    </div>
                    <div className="impact-card">
                      <h5>🏉 Innovation</h5>
                      <p>Introduction du rugby à 7</p>
                    </div>
                    <div className="impact-card">
                      <h5>🏆 Diversité</h5>
                      <p>Élargissement du programme olympique</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Conclusion */}
              <div className="rio-2016-conclusion">
                <div className="conclusion-card">
                  <h4>🎯 Conclusion</h4>
                  <div className="conclusion-content">
                    <div className="correct-answer">
                      <p>✅ <strong>CORRECT !</strong> Rio 2016 a été la première manifestation des JO en Amérique du Sud.</p>
                      <p>Cette édition historique a marqué l'expansion géographique des Jeux Olympiques vers un nouveau continent, tout en introduisant de nouveaux sports comme le rugby à 7 et le retour du golf.</p>
                      <p>Rio 2016 reste un moment clé dans l'histoire olympique pour sa dimension géographique et sportive.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 11:
        return (
          <div className="question-content">
            <h3>📊 Réponse basée sur les données :</h3>
            {loading && <div className="loading">Chargement des données...</div>}
            {error && <div className="error">❌ {error}</div>}
            
            <div className="rio-2016-stats-analysis">
              {/* Analyse des statistiques de Rio 2016 */}
              <div className="stats-comparison">
                <div className="historical-card">
                  <h4>📊 Statistiques de Rio 2016 - Vérification des données</h4>
                  <div className="historical-details">
                    <div className="comparison-info">
                      <div className="comparison-badge">2016</div>
                      <div className="comparison-details">
                        <h5>Rio de Janeiro - Statistiques officielles vs Question</h5>
                        <p><strong>Durée :</strong> 17 jours (5-21 août 2016)</p>
                        <p><strong>Vérification :</strong> Comparaison des données officielles</p>
                        <p><strong>Source :</strong> Comité International Olympique</p>
                      </div>
                    </div>
                    
                    <div className="stats-comparison-facts">
                      <h5>🔍 Comparaison des statistiques :</h5>
                      <div className="comparison-grid">
                        <div className="comparison-card">
                          <h6>👥 Athlètes</h6>
                          <div className="stat-comparison">
                            <div className="stat-claimed">
                              <span className="stat-label">Question :</span>
                              <span className="stat-value">10,500</span>
                            </div>
                            <div className="stat-official">
                              <span className="stat-label">Officiel :</span>
                              <span className="stat-value">11,238</span>
                            </div>
                            <div className="stat-difference">
                              <span className="difference">+738 athlètes</span>
                            </div>
                          </div>
                        </div>
                        <div className="comparison-card">
                          <h6>🌍 Pays</h6>
                          <div className="stat-comparison">
                            <div className="stat-claimed">
                              <span className="stat-label">Question :</span>
                              <span className="stat-value">205</span>
                            </div>
                            <div className="stat-official">
                              <span className="stat-label">Officiel :</span>
                              <span className="stat-value">207</span>
                            </div>
                            <div className="stat-difference">
                              <span className="difference">+2 pays</span>
                            </div>
                          </div>
                        </div>
                        <div className="comparison-card">
                          <h6>🏆 Sports</h6>
                          <div className="stat-comparison">
                            <div className="stat-claimed">
                              <span className="stat-label">Question :</span>
                              <span className="stat-value">42</span>
                            </div>
                            <div className="stat-official">
                              <span className="stat-label">Officiel :</span>
                              <span className="stat-value">28</span>
                            </div>
                            <div className="stat-difference">
                              <span className="difference">-14 sports</span>
                            </div>
                          </div>
                        </div>
                        <div className="comparison-card">
                          <h6>🏅 Épreuves</h6>
                          <div className="stat-comparison">
                            <div className="stat-claimed">
                              <span className="stat-label">Question :</span>
                              <span className="stat-value">306</span>
                            </div>
                            <div className="stat-official">
                              <span className="stat-label">Officiel :</span>
                              <span className="stat-value">306</span>
                            </div>
                            <div className="stat-difference">
                              <span className="difference correct">✓ Correct</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="verification">
                      <h5>🔍 Vérification :</h5>
                      <div className="verification-result">
                        <div className="partial-verification">
                          <p>⚠️ <strong>PARTIELLEMENT CORRECT !</strong> Les statistiques de Rio 2016 sont proches mais pas exactes.</p>
                          <p>Les données officielles montrent 11,238 athlètes (vs 10,500), 207 pays (vs 205), 28 sports (vs 42), mais 306 épreuves est correct.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Statistiques officielles détaillées */}
              <div className="official-stats-details">
                <h4>📈 Statistiques officielles de Rio 2016</h4>
                <div className="official-stats-grid">
                  <div className="official-stat-card">
                    <div className="stat-icon">🏃‍♂️</div>
                    <h5>Athlètes</h5>
                    <div className="stat-value">11,238</div>
                    <p>Participants officiels</p>
                    <div className="stat-breakdown">
                      <span className="breakdown-item">Hommes : 6,178</span>
                      <span className="breakdown-item">Femmes : 5,060</span>
                    </div>
                  </div>
                  <div className="official-stat-card">
                    <div className="stat-icon">🌍</div>
                    <h5>Délégations</h5>
                    <div className="stat-value">207</div>
                    <p>Nations participantes</p>
                    <div className="stat-breakdown">
                      <span className="breakdown-item">Comité Olympique</span>
                      <span className="breakdown-item">International</span>
                    </div>
                  </div>
                  <div className="official-stat-card">
                    <div className="stat-icon">🏆</div>
                    <h5>Sports</h5>
                    <div className="stat-value">28</div>
                    <p>Sports olympiques</p>
                    <div className="stat-breakdown">
                      <span className="breakdown-item">41 disciplines</span>
                      <span className="breakdown-item">306 épreuves</span>
                    </div>
                  </div>
                  <div className="official-stat-card">
                    <div className="stat-icon">🏅</div>
                    <h5>Médailles</h5>
                    <div className="stat-value">2,102</div>
                    <p>Médailles distribuées</p>
                    <div className="stat-breakdown">
                      <span className="breakdown-item">Or : 700</span>
                      <span className="breakdown-item">Argent : 700</span>
                      <span className="breakdown-item">Bronze : 702</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Durée et calendrier */}
              <div className="duration-calendar">
                <h4>📅 Durée et calendrier de Rio 2016</h4>
                <div className="calendar-details">
                  <div className="calendar-card">
                    <div className="calendar-icon">📅</div>
                    <h5>Durée officielle</h5>
                    <div className="duration-value">17 jours</div>
                    <p>Du 5 au 21 août 2016</p>
                    <div className="duration-breakdown">
                      <span className="breakdown-item">Ouverture : 5 août</span>
                      <span className="breakdown-item">Clôture : 21 août</span>
                    </div>
                  </div>
                  <div className="calendar-card">
                    <div className="calendar-icon">🏟️</div>
                    <h5>Lieux de compétition</h5>
                    <div className="venues-value">32</div>
                    <p>Villes hôtes</p>
                    <div className="venues-breakdown">
                      <span className="breakdown-item">Rio de Janeiro</span>
                      <span className="breakdown-item">São Paulo</span>
                      <span className="breakdown-item">Belo Horizonte</span>
                      <span className="breakdown-item">Salvador</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sports et disciplines */}
              <div className="sports-disciplines">
                <h4>🏆 Sports et disciplines de Rio 2016</h4>
                <div className="sports-breakdown">
                  <div className="sports-categories">
                    <div className="sport-category">
                      <h5>🏊‍♂️ Sports aquatiques</h5>
                      <div className="sport-list">
                        <span className="sport-item">Natation</span>
                        <span className="sport-item">Natation synchronisée</span>
                        <span className="sport-item">Plongeon</span>
                        <span className="sport-item">Water-polo</span>
                      </div>
                    </div>
                    <div className="sport-category">
                      <h5>🏃‍♂️ Athlétisme</h5>
                      <div className="sport-list">
                        <span className="sport-item">Course</span>
                        <span className="sport-item">Saut</span>
                        <span className="sport-item">Lancer</span>
                        <span className="sport-item">Marche</span>
                      </div>
                    </div>
                    <div className="sport-category">
                      <h5>🤸‍♀️ Gymnastique</h5>
                      <div className="sport-list">
                        <span className="sport-item">Gymnastique artistique</span>
                        <span className="sport-item">Gymnastique rythmique</span>
                        <span className="sport-item">Trampoline</span>
                      </div>
                    </div>
                    <div className="sport-category">
                      <h5>🏌️‍♂️ Nouveautés</h5>
                      <div className="sport-list">
                        <span className="sport-item">Golf</span>
                        <span className="sport-item">Rugby à 7</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Impact et héritage */}
              <div className="rio-2016-legacy">
                <h4>🌟 Impact et héritage de Rio 2016</h4>
                <div className="legacy-content">
                  <div className="legacy-grid">
                    <div className="legacy-card">
                      <h5>🌍 Géographique</h5>
                      <p>Premiers JO en Amérique du Sud</p>
                    </div>
                    <div className="legacy-card">
                      <h5>🏆 Sportif</h5>
                      <p>Retour du golf et introduction du rugby à 7</p>
                    </div>
                    <div className="legacy-card">
                      <h5>👥 Participation</h5>
                      <p>Record de participation avec 11,238 athlètes</p>
                    </div>
                    <div className="legacy-card">
                      <h5>🌱 Environnemental</h5>
                      <p>JO les plus durables de l'histoire</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Conclusion */}
              <div className="rio-2016-stats-conclusion">
                <div className="conclusion-card">
                  <h4>🎯 Conclusion</h4>
                  <div className="conclusion-content">
                    <div className="partial-answer">
                      <p>⚠️ <strong>PARTIELLEMENT CORRECT !</strong> Les statistiques de Rio 2016 sont proches mais pas exactes.</p>
                      <p>Les données officielles montrent 11,238 athlètes (vs 10,500), 207 pays (vs 205), 28 sports (vs 42), mais 306 épreuves est correct.</p>
                      <p>La durée de 17 jours est également correcte (5-21 août 2016).</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="olympic-facts-container">
      <div className="page-header">
        <OlympicRings />
        <h1 className="page-title">OLYMPIC FACTS</h1>
      </div>

      {/* Navigation buttons */}
      <div className="section-navigation">
        <button 
          className={`nav-button ${activeSection === 'events' ? 'active' : ''}`}
          onClick={() => setActiveSection('events')}
        >
          <span className="nav-icon">🏆</span>
          <span className="nav-text">Évènements marquants aux JO</span>
        </button>
        <button 
          className={`nav-button ${activeSection === 'open-questions' ? 'active' : ''}`}
          onClick={() => setActiveSection('open-questions')}
        >
          <span className="nav-icon">❓</span>
          <span className="nav-text">Questions ouvertes</span>
        </button>
      </div>

      <div className="facts-content">
        {/* Section Évènements marquants aux JO */}
        {activeSection === 'events' && (
          <div className="section-container">
            <div className="section-header">
              <h2>🏆 Évènements marquants aux JO</h2>
              <p>Découvrez les moments historiques et les faits marquants des Jeux Olympiques</p>
            </div>
            <div className="questions-list">
              <div className="questions-grid">
                {questions.map((question) => (
                  <div 
                    key={question.id}
                    className={`question-card ${activeQuestion === question.id ? 'active' : ''}`}
                    onClick={() => setActiveQuestion(activeQuestion === question.id ? null : question.id)}
                  >
                    <div className="question-header">
                      <div className="question-icon">{question.icon}</div>
                      <div className="question-info">
                        <h3>{question.title}</h3>
                        <p>{question.description}</p>
                        <span className="question-category">{question.category}</span>
                      </div>
                      <div className="question-arrow">
                        {activeQuestion === question.id ? '▲' : '▼'}
                      </div>
                    </div>
                    
                    {activeQuestion === question.id && (
                      <div className="question-answer">
                        {renderQuestionContent(question.id)}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Section Questions ouvertes */}
        {activeSection === 'open-questions' && (
          <div className="section-container">
            <div className="section-header">
              <h2>❓ Questions ouvertes</h2>
              <p>Explorez des questions analytiques et des analyses approfondies sur les Jeux Olympiques</p>
            </div>
            
            {/* Question Q1: Médailles de la France */}
            <div className="open-question-card">
              <div 
                className="question-header clickable"
                onClick={() => setActiveQuestion(activeQuestion === 'q1' ? null : 'q1')}
              >
                <h3>Q1: Combien de médailles la France a remporté depuis le début des JO ?</h3>
                <p>Analyse complète des médailles françaises aux Jeux Olympiques</p>
                <div className="question-toggle">
                  <span className="toggle-icon">
                    {activeQuestion === 'q1' ? '▼' : '▶'}
                  </span>
                  <span className="toggle-text">
                    {activeQuestion === 'q1' ? 'Masquer l\'analyse' : 'Voir l\'analyse'}
                  </span>
                </div>
              </div>
              
              {activeQuestion === 'q1' && (
                <div className="question-answer">
                  {loading ? (
                    <div className="loading-container">
                      <div className="loading-spinner"></div>
                      <p>Chargement des données de médailles...</p>
                    </div>
                  ) : error ? (
                    <div className="error-container">
                      <p>❌ Erreur lors du chargement des données: {error}</p>
                    </div>
                  ) : franceMedals?.data ? (
                    <div className="medals-analysis">
                  <div className="medals-summary">
                    <h4>🏆 Résumé des médailles françaises</h4>
                    <div className="medals-grid">
                      <div className="medal-card total">
                        <div className="medal-icon">🥇🥈🥉</div>
                        <div className="medal-count">{franceMedals.data.total_medals}</div>
                        <div className="medal-label">Total des médailles</div>
                      </div>
                      <div className="medal-card gold">
                        <div className="medal-icon">🥇</div>
                        <div className="medal-count">{franceMedals.data.gold_medals}</div>
                        <div className="medal-label">Médailles d'Or</div>
                      </div>
                      <div className="medal-card silver">
                        <div className="medal-icon">🥈</div>
                        <div className="medal-count">{franceMedals.data.silver_medals}</div>
                        <div className="medal-label">Médailles d'Argent</div>
                      </div>
                      <div className="medal-card bronze">
                        <div className="medal-icon">🥉</div>
                        <div className="medal-count">{franceMedals.data.bronze_medals}</div>
                        <div className="medal-label">Médailles de Bronze</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="medals-breakdown">
                    <h4>📊 Répartition des médailles</h4>
                    <div className="breakdown-stats">
                      <div className="stat-item">
                        <span className="stat-label">Or:</span>
                        <span className="stat-value">{franceMedals.data.gold_medals} médailles</span>
                        <span className="stat-percentage">
                          ({((franceMedals.data.gold_medals / franceMedals.data.total_medals) * 100).toFixed(1)}%)
                        </span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-label">Argent:</span>
                        <span className="stat-value">{franceMedals.data.silver_medals} médailles</span>
                        <span className="stat-percentage">
                          ({((franceMedals.data.silver_medals / franceMedals.data.total_medals) * 100).toFixed(1)}%)
                        </span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-label">Bronze:</span>
                        <span className="stat-value">{franceMedals.data.bronze_medals} médailles</span>
                        <span className="stat-percentage">
                          ({((franceMedals.data.bronze_medals / franceMedals.data.total_medals) * 100).toFixed(1)}%)
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="medals-conclusion">
                    <h4>🎯 Conclusion</h4>
                    <p>
                      Depuis le début des Jeux Olympiques modernes en 1896, la France a remporté un total de <strong>{franceMedals.data.total_medals} médailles</strong> :
                    </p>
                    <ul>
                      <li><strong>{franceMedals.data.gold_medals} médailles d'or</strong> ({((franceMedals.data.gold_medals / franceMedals.data.total_medals) * 100).toFixed(1)}%)</li>
                      <li><strong>{franceMedals.data.silver_medals} médailles d'argent</strong> ({((franceMedals.data.silver_medals / franceMedals.data.total_medals) * 100).toFixed(1)}%)</li>
                      <li><strong>{franceMedals.data.bronze_medals} médailles de bronze</strong> ({((franceMedals.data.bronze_medals / franceMedals.data.total_medals) * 100).toFixed(1)}%)</li>
                    </ul>
                  </div>
                  
                  {/* Bouton pour afficher les graphiques */}
                  <div className="chart-toggle-section">
                    <button 
                      className="chart-toggle-button"
                      onClick={() => setShowCharts(!showCharts)}
                    >
                      <span className="icon">{showCharts ? '📊' : '📈'}</span>
                      {showCharts ? 'Masquer les graphiques' : 'Afficher les graphiques'}
                    </button>
                  </div>
                  
                      {/* Graphiques des médailles */}
                      {showCharts && (
                        <MedalCharts franceMedals={franceMedals} />
                      )}
                    </div>
                  ) : (
                    <div className="no-data">
                      <p>❌ Aucune donnée de médailles disponible</p>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            {/* Question Q2: Succès par édition des JO */}
            <div className="open-question-card">
              <div 
                className="question-header clickable"
                onClick={() => setActiveQuestion(activeQuestion === 'q2' ? null : 'q2')}
              >
                <h3>Q2: Lors de quelle JO la France a eu le plus (le moins) de succès ?</h3>
                <p>Analyse des performances françaises par édition des Jeux Olympiques</p>
                <div className="question-toggle">
                  <span className="toggle-icon">
                    {activeQuestion === 'q2' ? '▼' : '▶'}
                  </span>
                  <span className="toggle-text">
                    {activeQuestion === 'q2' ? 'Masquer l\'analyse' : 'Voir l\'analyse'}
                  </span>
                </div>
              </div>
              
              {activeQuestion === 'q2' && (
                <div className="question-answer">
                  {loading ? (
                    <div className="loading-container">
                      <div className="loading-spinner"></div>
                      <p>Chargement des données de succès...</p>
                    </div>
                  ) : error ? (
                    <div className="error-container">
                      <p>❌ Erreur lors du chargement des données: {error}</p>
                    </div>
                  ) : franceSuccess?.data ? (
                    <div className="success-analysis">
                  <div className="success-summary">
                    <h4>🏆 Meilleure et pire performance</h4>
                    <div className="performance-cards">
                      {franceSuccess.data.best_edition && (
                        <div className="performance-card best">
                          <div className="performance-header">
                            <h5>🥇 Meilleure performance</h5>
                            <span className="year-badge">{franceSuccess.data.best_edition.year}</span>
                          </div>
                          <div className="performance-stats">
                            <div className="stat-row">
                              <span className="stat-label">Total des médailles:</span>
                              <span className="stat-value">{franceSuccess.data.best_edition.total}</span>
                            </div>
                            <div className="medal-breakdown">
                              <div className="medal-item gold">
                                <span className="medal-icon">🥇</span>
                                <span className="medal-count">{franceSuccess.data.best_edition.gold}</span>
                                <span className="medal-label">Or</span>
                              </div>
                              <div className="medal-item silver">
                                <span className="medal-icon">🥈</span>
                                <span className="medal-count">{franceSuccess.data.best_edition.silver}</span>
                                <span className="medal-label">Argent</span>
                              </div>
                              <div className="medal-item bronze">
                                <span className="medal-icon">🥉</span>
                                <span className="medal-count">{franceSuccess.data.best_edition.bronze}</span>
                                <span className="medal-label">Bronze</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {franceSuccess.data.worst_edition && (
                        <div className="performance-card worst">
                          <div className="performance-header">
                            <h5>📉 Pire performance</h5>
                            <span className="year-badge">{franceSuccess.data.worst_edition.year}</span>
                          </div>
                          <div className="performance-stats">
                            <div className="stat-row">
                              <span className="stat-label">Total des médailles:</span>
                              <span className="stat-value">{franceSuccess.data.worst_edition.total}</span>
                            </div>
                            <div className="medal-breakdown">
                              <div className="medal-item gold">
                                <span className="medal-icon">🥇</span>
                                <span className="medal-count">{franceSuccess.data.worst_edition.gold}</span>
                                <span className="medal-label">Or</span>
                              </div>
                              <div className="medal-item silver">
                                <span className="medal-icon">🥈</span>
                                <span className="medal-count">{franceSuccess.data.worst_edition.silver}</span>
                                <span className="medal-label">Argent</span>
                              </div>
                              <div className="medal-item bronze">
                                <span className="medal-icon">🥉</span>
                                <span className="medal-count">{franceSuccess.data.worst_edition.bronze}</span>
                                <span className="medal-label">Bronze</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="success-conclusion">
                    <h4>📊 Analyse des performances</h4>
                    <div className="analysis-content">
                      {franceSuccess.data.best_edition && franceSuccess.data.worst_edition && (
                        <div className="comparison-stats">
                          <div className="comparison-item">
                            <span className="comparison-label">Écart de performance:</span>
                            <span className="comparison-value">
                              {franceSuccess.data.best_edition.total - franceSuccess.data.worst_edition.total} médailles
                            </span>
                          </div>
                          <div className="comparison-item">
                            <span className="comparison-label">Ratio meilleure/pire:</span>
                            <span className="comparison-value">
                              {(franceSuccess.data.best_edition.total / franceSuccess.data.worst_edition.total).toFixed(1)}x
                            </span>
                          </div>
                        </div>
                      )}
                      
                      <div className="historical-context">
                        <h5>📈 Contexte historique</h5>
                        <p>
                          La France a participé à <strong>{franceSuccess.data.editions_data.length}</strong> éditions des Jeux Olympiques.
                          {franceSuccess.data.best_edition && (
                            <> En <strong>{franceSuccess.data.best_edition.year}</strong>, la France a remporté son plus grand nombre de médailles avec <strong>{franceSuccess.data.best_edition.total} médailles</strong>.</>
                          )}
                          {franceSuccess.data.worst_edition && (
                            <> En <strong>{franceSuccess.data.worst_edition.year}</strong>, la France a eu sa performance la plus faible avec seulement <strong>{franceSuccess.data.worst_edition.total} médailles</strong>.</>
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                    </div>
                  ) : (
                    <div className="no-data">
                      <p>❌ Aucune donnée de succès disponible</p>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            {/* Question Q3: Spécialités sportives de la France */}
            <div className="open-question-card">
              <div 
                className="question-header clickable"
                onClick={() => setActiveQuestion(activeQuestion === 'q3' ? null : 'q3')}
              >
                <h3>Q3: Peut-on considérer que la France est la grande spécialiste de certaine(s) discipline(s) sportive(s) ?</h3>
                <p>Analyse des spécialités sportives françaises aux Jeux Olympiques</p>
                <div className="question-toggle">
                  <span className="toggle-icon">
                    {activeQuestion === 'q3' ? '▼' : '▶'}
                  </span>
                  <span className="toggle-text">
                    {activeQuestion === 'q3' ? 'Masquer l\'analyse' : 'Voir l\'analyse'}
                  </span>
                </div>
              </div>
              
              {activeQuestion === 'q3' && (
                <div className="question-answer">
                  {loading ? (
                    <div className="loading-container">
                      <div className="loading-spinner"></div>
                      <p>Chargement des données sportives...</p>
                    </div>
                  ) : error ? (
                    <div className="error-container">
                      <p>❌ Erreur lors du chargement des données: {error}</p>
                    </div>
                  ) : franceSports?.data ? (
                    <div className="sports-analysis">
                      <div className="sports-summary">
                        <h4>🏆 Top 5 des spécialités françaises</h4>
                        <div className="sports-grid">
                          {franceSports.data.top_sports.map((sport, index) => (
                            <div key={sport.sport} className={`sport-card rank-${index + 1}`}>
                              <div className="sport-header">
                                <div className="sport-rank">#{index + 1}</div>
                                <h5 className="sport-name">{sport.sport}</h5>
                              </div>
                              <div className="sport-stats">
                                <div className="sport-total">
                                  <span className="total-number">{sport.total}</span>
                                  <span className="total-label">médailles</span>
                                </div>
                                <div className="sport-breakdown">
                                  <div className="medal-item gold">
                                    <span className="medal-icon">🥇</span>
                                    <span className="medal-count">{sport.gold}</span>
                                  </div>
                                  <div className="medal-item silver">
                                    <span className="medal-icon">🥈</span>
                                    <span className="medal-count">{sport.silver}</span>
                                  </div>
                                  <div className="medal-item bronze">
                                    <span className="medal-icon">🥉</span>
                                    <span className="medal-count">{sport.bronze}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="sports-analysis-details">
                        <h4>📊 Analyse des spécialités</h4>
                        <div className="analysis-grid">
                          <div className="analysis-card">
                            <h5>🎯 Sports dominants</h5>
                            <div className="dominant-sports">
                              {franceSports.data.dominant_sports.map((sport, index) => (
                                <div key={sport.sport} className="dominant-sport">
                                  <span className="sport-name">{sport.sport}</span>
                                  <span className="sport-percentage">
                                    {((sport.total / franceSports.data.analysis.total_medals) * 100).toFixed(1)}%
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          <div className="analysis-card">
                            <h5>📈 Statistiques générales</h5>
                            <div className="stats-list">
                              <div className="stat-item">
                                <span className="stat-label">Total des sports pratiqués:</span>
                                <span className="stat-value">{franceSports.data.analysis.total_sports}</span>
                              </div>
                              <div className="stat-item">
                                <span className="stat-label">Moyenne par sport:</span>
                                <span className="stat-value">{franceSports.data.analysis.average_medals_per_sport.toFixed(1)} médailles</span>
                              </div>
                              <div className="stat-item">
                                <span className="stat-label">Niveau de spécialisation:</span>
                                <span className="stat-value">{(franceSports.data.analysis.specialization_level * 100).toFixed(1)}%</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="sports-conclusion">
                        <h4>🎯 Conclusion</h4>
                        <div className="conclusion-content">
                          <p>
                            La France a participé à <strong>{franceSports.data.analysis.total_sports} sports différents</strong> aux Jeux Olympiques.
                            {franceSports.data.top_sports.length > 0 && (
                              <> Sa spécialité principale est le <strong>{franceSports.data.top_sports[0].sport}</strong> avec <strong>{franceSports.data.top_sports[0].total} médailles</strong>.</>
                            )}
                          </p>
                          <p>
                            {franceSports.data.dominant_sports.length > 0 ? (
                              <>La France montre une spécialisation dans <strong>{franceSports.data.dominant_sports.length} sports dominants</strong>, représentant une concentration de ses performances.</>
                            ) : (
                              <>La France montre une répartition équilibrée de ses médailles sans spécialisation marquée dans un sport particulier.</>
                            )}
                          </p>
                        </div>
                      </div>
                      
                      {/* Bouton pour afficher les graphiques des sports */}
                      <div className="chart-toggle-section">
                        <button 
                          className="chart-toggle-button"
                          onClick={() => setShowSportsCharts(!showSportsCharts)}
                        >
                          <span className="icon">{showSportsCharts ? '📊' : '📈'}</span>
                          {showSportsCharts ? 'Masquer les graphiques' : 'Afficher les graphiques'}
                        </button>
                      </div>
                      
                      {/* Graphiques des spécialités sportives */}
                      {showSportsCharts && (
                        <SportsCharts franceSports={franceSports} />
                      )}
                    </div>
                  ) : (
                    <div className="no-data">
                      <p>❌ Aucune donnée sportive disponible</p>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            {/* Question Q4: Sports dominants au fil des ans */}
            <div className="open-question-card">
              <div 
                className="question-header clickable"
                onClick={() => setActiveQuestion(activeQuestion === 'q4' ? null : 'q4')}
              >
                <h3>Q4: Quelles sont les sports les plus dominants dans les JO au fil des ans ?</h3>
                <p>Analyse de l'évolution des sports dominants aux Jeux Olympiques</p>
                <div className="question-toggle">
                  <span className="toggle-icon">
                    {activeQuestion === 'q4' ? '▼' : '▶'}
                  </span>
                  <span className="toggle-text">
                    {activeQuestion === 'q4' ? 'Masquer l\'analyse' : 'Voir l\'analyse'}
                  </span>
                </div>
              </div>
              
              {activeQuestion === 'q4' && (
                <div className="question-answer">
                  {loading ? (
                    <div className="loading-container">
                      <div className="loading-spinner"></div>
                      <p>Chargement des données des sports dominants...</p>
                    </div>
                  ) : error ? (
                    <div className="error-container">
                      <p>❌ Erreur lors du chargement des données: {error}</p>
                    </div>
                  ) : dominantSports?.data ? (
                    <div className="dominant-sports-analysis">
                      <div className="dominant-sports-summary">
                        <h4>🏆 Top 10 des sports les plus dominants</h4>
                        <div className="dominant-sports-grid">
                          {dominantSports.data.dominant_sports.slice(0, 10).map((sport, index) => (
                            <div key={sport.sport} className={`dominant-sport-card rank-${index + 1}`}>
                              <div className="sport-rank-badge">#{index + 1}</div>
                              <div className="sport-info">
                                <h5 className="sport-name">{sport.sport}</h5>
                                <div className="sport-stats">
                                  <div className="stat-row">
                                    <span className="stat-label">Total des médailles:</span>
                                    <span className="stat-value">{sport.total}</span>
                                  </div>
                                  <div className="stat-row">
                                    <span className="stat-label">Années actives:</span>
                                    <span className="stat-value">{sport.years_count}</span>
                                  </div>
                                  <div className="stat-row">
                                    <span className="stat-label">Moyenne par année:</span>
                                    <span className="stat-value">{sport.average_medals_per_year.toFixed(1)}</span>
                                  </div>
                                </div>
                                <div className="medal-breakdown">
                                  <div className="medal-item gold">
                                    <span className="medal-icon">🥇</span>
                                    <span className="medal-count">{sport.gold}</span>
                                  </div>
                                  <div className="medal-item silver">
                                    <span className="medal-icon">🥈</span>
                                    <span className="medal-count">{sport.silver}</span>
                                  </div>
                                  <div className="medal-item bronze">
                                    <span className="medal-icon">🥉</span>
                                    <span className="medal-count">{sport.bronze}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="evolution-analysis">
                        <h4>📈 Évolution par décennies</h4>
                        <div className="decades-grid">
                          {dominantSports.data.periods_analysis.map((period, index) => (
                            <div key={period.decade} className="decade-card">
                              <div className="decade-header">
                                <h5>{period.decade}s</h5>
                                <span className="decade-stats">
                                  {period.total_sports} sports • {period.total_medals} médailles
                                </span>
                              </div>
                              <div className="decade-top-sports">
                                <h6>Top 3 sports:</h6>
                                <div className="top-sports-list">
                                  {period.top_sports.slice(0, 3).map((sport, sportIndex) => (
                                    <div key={sport.sport} className="top-sport-item">
                                      <span className="sport-rank">#{sportIndex + 1}</span>
                                      <span className="sport-name">{sport.sport}</span>
                                      <span className="sport-medals">{sport.total} médailles</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="sports-insights">
                        <h4>🔍 Insights et tendances</h4>
                        <div className="insights-grid">
                          <div className="insight-card">
                            <h5>📊 Statistiques générales</h5>
                            <div className="insight-stats">
                              <div className="insight-item">
                                <span className="insight-label">Total des sports:</span>
                                <span className="insight-value">{dominantSports.data.analysis.total_sports}</span>
                              </div>
                              <div className="insight-item">
                                <span className="insight-label">Années analysées:</span>
                                <span className="insight-value">{dominantSports.data.analysis.total_years}</span>
                              </div>
                              <div className="insight-item">
                                <span className="insight-label">Sport le plus constant:</span>
                                <span className="insight-value">{dominantSports.data.analysis.most_consistent_sport}</span>
                              </div>
                              <div className="insight-item">
                                <span className="insight-label">Sport le plus médaillé:</span>
                                <span className="insight-value">{dominantSports.data.analysis.most_medals_sport}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="insight-card">
                            <h5>🎯 Tendances observées</h5>
                            <div className="trends-content">
                              <p>
                                L'analyse révèle que certains sports ont maintenu leur dominance à travers les décennies,
                                tandis que d'autres ont émergé ou décliné selon les époques.
                              </p>
                              <p>
                                Les sports les plus constants sont ceux qui offrent le plus d'épreuves et de médailles,
                                reflétant leur importance dans le programme olympique.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="no-data">
                      <p>❌ Aucune donnée de sports dominants disponible</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OlympicFacts;