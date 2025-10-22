import React from 'react';
import OlympicRings from '../components/OlympicRings';
import './OlympicFacts.css';

const OlympicFacts = () => {
  const facts = {
    ancient: {
      title: "Jeux Olympiques Antiques",
      facts: [
        {
          quote: "Les premiers Jeux Olympiques ont eu lieu au 8ème siècle avant J.-C. à Olympie, en Grèce. Organisés tous les quatre ans, en l'honneur du dieu grec Zeus, les archives montrent que les Jeux Olympiques antiques ont commencé en 776 av. J.-C. à Olympie et n'ont été interrompus qu'en 394 apr. J.-C. Puis, au 4ème siècle apr. J.-C., tous les festivals païens ont été interdits par l'empereur Théodose Ier et les Jeux Olympiques ont disparu.",
          source: "Education First: Culture"
        }
      ]
    },
    modern: {
      title: "Jeux Olympiques Modernes",
      facts: [
        {
          quote: "Les premiers Jeux Olympiques modernes ont eu lieu en 1896 à Athènes, en Grèce, et ont coûté environ 448 000 $. Comparez cela aux Jeux Olympiques les plus récents de Rio 2016 qui ont coûté 13,1 milliards de dollars.",
          source: "Team Empower Hour"
        },
        {
          quote: "Les Jeux Olympiques ont été ressuscités environ 1500 ans plus tard après le 4ème siècle apr. J.-C. Les premiers Jeux Olympiques modernes ont eu lieu en 1896 en Grèce. Les Jeux Olympiques modernes sont basés sur les Jeux Olympiques de la Grèce antique.",
          source: "Education First: Culture"
        },
        {
          quote: "Les Jeux Olympiques ont été accueillis par 23 pays différents. Les Jeux de Londres 2012 ont été les premiers Jeux Olympiques auxquels tous les pays participants ont envoyé des athlètes féminines.",
          source: "Education First: Culture"
        },
        {
          quote: "L'anglais et le français sont les langues officielles des Jeux Olympiques. Elles sont complétées par la langue officielle du pays hôte.",
          source: "WorldStrides"
        },
        {
          quote: "Les médailles d'or sont principalement faites d'argent. Malgré la croyance populaire que la médaille d'or est composée d'or pur, ce n'est plus le cas depuis les Jeux Olympiques de 1912. La médaille d'or olympique d'aujourd'hui est un imposteur, faite presque entièrement d'argent avec environ 6 grammes d'or pour répondre à la norme établie dans la Charte olympique.",
          source: "Athlon Sports"
        },
        {
          quote: "Les médaillés ne sont pas seulement intronisés dans l'histoire de leur nation et l'histoire olympique, mais ils sont également honorés au stade olympique du tournoi de cette année. Leurs noms sont gravés sur les murs du stade - permettant à leur héritage d'être écrit dans la pierre.",
          source: "Champions (UK)"
        },
        {
          quote: "Pour qu'un sport soit inclus dans les Jeux Olympiques, il doit être pratiqué par les hommes dans 75 pays sur au moins 4 continents et par les femmes dans 40 pays sur au moins 3 continents.",
          source: "Team Empower Hour"
        },
        {
          quote: "L'Afrique et l'Antarctique sont les seuls continents où les Jeux Olympiques n'ont jamais eu lieu.",
          source: "Team Empower Hour"
        }
      ]
    },
    prize: {
      title: "Prix Olympique",
      facts: [
        {
          quote: "Le prix pour les gagnants d'événements dans les Jeux Olympiques antiques était une couronne de branches d'olivier.",
          source: "SK: Summer Olympic Games"
        },
        {
          quote: "Depuis les Jeux Olympiques de 1904, des médailles sont décernées dans chaque événement, avec des médailles d'or pour la première place, d'argent pour la deuxième et de bronze pour la troisième.",
          source: "SK: Summer Olympic Games"
        }
      ]
    },
    motto: {
      title: "Devise Olympique",
      facts: [
        {
          quote: "La devise olympique est \"Citius, Altius, Fortius\", qui signifie en latin \"Plus vite, Plus haut, Plus fort\". Elle a été proposée par Pierre de Coubertin lors de la création du Comité International Olympique en 1894.",
          source: "International Olympic Committee Media Relations"
        }
      ]
    },
    torch: {
      title: "Flamme Olympique",
      facts: [
        {
          quote: "La flamme olympique est allumée à Olympie en Grèce tous les deux ans (Jeux Olympiques d'été et d'hiver) avant de se rendre dans le prochain pays hôte où elle est paradée jusqu'à l'allumage du Chaudron Olympique lors de la cérémonie d'ouverture.",
          source: "SK: Summer Olympic Games"
        },
        {
          quote: "La torche olympique est allumée de manière traditionnelle lors d'une cérémonie antique au temple d'Héra, en Grèce : Des actrices, vêtues de costumes de prêtresses grecques, utilisent un miroir parabolique et les rayons du soleil pour allumer la torche.",
          source: "Education First: Culture"
        },
        {
          quote: "Partant de Grèce, la torche commence sa relève vers la ville hôte : Elle est généralement portée par des coureurs, mais elle a voyagé en bateau, en avion (et le Concorde), à cheval, sur le dos d'un chameau, via signal radio, sous l'eau, et en canoë.",
          source: "Education First: Culture"
        },
        {
          quote: "La torche de relève et la flamme olympique sont censées brûler pendant tout l'événement. Au cas où la flamme s'éteindrait, elle ne peut être rallumée qu'avec une flamme de secours, qui a également été allumée en Grèce, et jamais avec un briquet ordinaire !",
          source: "Education First: Culture"
        },
        {
          quote: "La torche olympique éteinte a également été emmenée dans l'espace plusieurs fois.",
          source: "Education First: Culture"
        }
      ]
    },
    symbol: {
      title: "Symbole Olympique",
      facts: [
        {
          quote: "Les cinq anneaux du symbole olympique - conçu par le baron Pierre de Coubertin, co-fondateur des Jeux Olympiques modernes - représentent les cinq continents habités du monde (Afrique, Asie, Australie, Europe et Amériques), ils sont liés ensemble dans l'amitié.",
          source: "Education First: Culture"
        },
        {
          quote: "Les six couleurs - bleu, jaune, noir, vert, rouge, et le fond blanc - ont été choisies parce que le drapeau de chaque nation en contient au moins une.",
          source: "Education First: Culture"
        }
      ]
    },
    cancelled: {
      title: "Jeux Olympiques annulés",
      facts: [
        {
          quote: "Depuis l'ouverture des premiers Jeux Olympiques modernes en 1896, la compétition sportive internationale n'a été annulée que trois fois : une fois pendant la Première Guerre mondiale (1916) et deux fois pendant la Seconde Guerre mondiale (1940, 1944). Jusqu'à l'épidémie de COVID-19 de 2020, qui a reporté les Jeux Olympiques d'été d'un an, les Jeux Olympiques ont résisté aux boycotts politiquement chargés et à deux attaques terroristes distinctes sans être annulés ou reportés en temps de paix.",
          source: "International Olympic Committee Media Relations"
        },
        {
          quote: "Les Jeux Olympiques d'été de 2020, initialement prévus à Tokyo, au Japon, entre le 24 juillet et le 9 août 2020, ont été reprogrammés du 23 juillet au 8 août 2021 à la suite de la pandémie de COVID-19. Les Jeux de la XXXIIe Olympiade conserveront le nom Tokyo 2020 à des fins de marketing et de branding malgré leur tenue en 2021.",
          source: "Davis Roos - When World Events Disrupted the Olympics"
        }
      ]
    },
    marathon: {
      title: "Marathon des Jeux Olympiques de 1904",
      facts: [
        {
          quote: "Aux Jeux Olympiques de 1904 à Saint-Louis, le marathon était un désastre total : le premier arrivé a fait la plupart de la course en voiture, le deuxième a failli mourir en mangeant du poison à rats, et le quatrième arrivé a couru en pantalon et chaussures de ville, et a fait une sieste sur le bord de la route pendant une partie de la course.",
          source: "Quora"
        }
      ]
    },
    women: {
      title: "Participation des Femmes",
      facts: [
        {
          quote: "Les femmes sont autorisées à participer aux Jeux Olympiques depuis 1900.",
          source: "Team Empower Hour"
        },
        {
          quote: "Les Jeux Olympiques de Londres 2012 ont été connus sous le nom de Jeux des Femmes car c'était les premiers Jeux Olympiques d'été qui ont mis en valeur la véritable égalité. Les femmes n'ont été exclues d'aucun sport et pour la première fois dans l'histoire, chaque nation a envoyé une concurrente féminine.",
          source: "Champions (UK)"
        }
      ]
    }
  };

  return (
    <div className="olympic-facts-container">
      <div className="page-header">
        <OlympicRings />
        <h1 className="page-title">OLYMPIC FACTS</h1>
      </div>

      <div className="facts-content">
        {Object.entries(facts).map(([key, section]) => (
          <div key={key} className="facts-section">
            <h2>{section.title}</h2>
            {section.facts.map((fact, index) => (
              <div key={index} className="fact-item">
                <blockquote>{fact.quote}</blockquote>
                <div className="fact-source">{fact.source}</div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default OlympicFacts;
