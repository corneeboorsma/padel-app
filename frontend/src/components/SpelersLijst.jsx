import { apiFetch } from '../api';

export default function SpelersLijst({ spelers, onVerwijder, isAdmin }) {
  const handleExport = () => {
    const base = import.meta.env.VITE_API_URL ?? '';
    window.location.href = `${base}/api/spelers/export`;
  };

  const formatDatum = (iso) =>
    new Date(iso).toLocaleDateString('nl-BE', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });

  return (
    <div className="card">
      <div className="table-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <h2>Inschrijvingen</h2>
          <span className="badge">{spelers.length}</span>
        </div>
        {isAdmin && spelers.length > 0 && (
          <button className="btn btn-success" onClick={handleExport}>
            ↓ Export CSV
          </button>
        )}
      </div>

      {spelers.length === 0 ? (
        <div className="empty-state">Nog geen inschrijvingen. Voeg de eerste speler toe!</div>
      ) : (
        <>
          {/* Desktop tabel */}
          <table className="desktop-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Naam</th>
                {isAdmin && <th>E-mail</th>}
                {isAdmin && <th>Telefoon</th>}
                <th>Datum</th>
                {isAdmin && <th></th>}
              </tr>
            </thead>
            <tbody>
              {spelers.map((s, i) => (
                <tr key={s.id}>
                  <td className="text-muted">{i + 1}</td>
                  <td><strong>{s.naam}</strong></td>
                  {isAdmin && <td>{s.email}</td>}
                  {isAdmin && <td>{s.telefoon || <span className="text-muted">—</span>}</td>}
                  <td className="text-muted">{formatDatum(s.created_at)}</td>
                  {isAdmin && (
                    <td>
                      <button className="btn btn-danger" onClick={() => onVerwijder(s.id)}>
                        Verwijder
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>

          {/* Mobiele kaartjes */}
          <div className="mobile-list">
            {spelers.map((s, i) => (
              <div key={s.id} className="mobile-card">
                <div className="mobile-card-header">
                  <span className="mobile-card-num">{i + 1}</span>
                  <strong className="mobile-card-naam">{s.naam}</strong>
                  {isAdmin && (
                    <button className="btn btn-danger" onClick={() => onVerwijder(s.id)}>
                      Verwijder
                    </button>
                  )}
                </div>
                <div className="mobile-card-body">
                  {isAdmin && <span>{s.email}</span>}
                  {isAdmin && s.telefoon && <span>{s.telefoon}</span>}
                  <span className="text-muted">{formatDatum(s.created_at)}</span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
