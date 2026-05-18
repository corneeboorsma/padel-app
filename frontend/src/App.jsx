import { useState, useEffect, useCallback } from 'react';
import RegistratieForm from './components/RegistratieForm';
import SpelersLijst from './components/SpelersLijst';
import heroPadel from './assets/hero-padel.png';
import { apiFetch } from './api';

export default function App() {
  const [spelers, setSpelers] = useState([]);

  const laadSpelers = useCallback(async () => {
    try {
      const res = await apiFetch('/api/spelers');
      const data = await res.json();
      setSpelers(data);
    } catch {
      console.error('Kon spelers niet laden');
    }
  }, []);

  useEffect(() => { laadSpelers(); }, [laadSpelers]);

  const verwijderSpeler = async (id) => {
    if (!window.confirm('Wil je deze inschrijving verwijderen?')) return;
    await apiFetch(`/api/spelers/${id}`, { method: 'DELETE' });
    laadSpelers();
  };

  return (
    <>
      <nav className="site-nav">
        <span className="club-name">TC de Mors &nbsp;<span>|</span>&nbsp; Padel</span>
        <span className="nav-tag">De gezelligste tennis- &amp; padelclub van Rijssen</span>
      </nav>

      <div className="page-content">
        <div className="hero-banner">
          <img src={heroPadel} alt="Padel club sfeer" className="hero-img" />
          <div className="hero-overlay">
            <h1>Padel Inschrijvingen</h1>
            <p className="hero-tagline">Play · Connect · Enjoy</p>
          </div>
        </div>

        <div className="event-info">
          <div className="event-info-item">
            <span className="event-icon">📅</span>
            <div>
              <span className="event-label">Datum</span>
              <span className="event-value">Zaterdag 13 juni 2026</span>
            </div>
          </div>
          <div className="event-divider" />
          <div className="event-info-item">
            <span className="event-icon">🕒</span>
            <div>
              <span className="event-label">Padel</span>
              <span className="event-value">15:00 – 18:00</span>
            </div>
          </div>
          <div className="event-divider" />
          <div className="event-info-item">
            <span className="event-icon">🍻</span>
            <div>
              <span className="event-label">Nadien</span>
              <span className="event-value">Gezamenlijk eten &amp; drinken</span>
            </div>
          </div>
        </div>

        <div className="info-notice">
          <span className="info-notice-icon">ℹ️</span>
          <span>Op basis van het aantal inschrijvingen bepalen we of we 2 wedstrijden spelen op de middag of kiezen voor een King of the Court concept.</span>
        </div>

        <RegistratieForm onInschrijving={laadSpelers} />
        <SpelersLijst spelers={spelers} onVerwijder={verwijderSpeler} />
      </div>

      <footer className="site-footer">
        TC de Mors · Opbroekweg 40, 7461 PH Rijssen ·{' '}
        <a href="https://www.tcdemors.nl" target="_blank" rel="noreferrer">tcdemors.nl</a>
      </footer>
    </>
  );
}
