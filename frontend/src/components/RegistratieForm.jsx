import { useState } from 'react';
import { apiFetch } from '../api';

const leeg = { naam: '', email: '', telefoon: '' };

export default function RegistratieForm({ onInschrijving }) {
  const [form, setForm] = useState(leeg);
  const [fout, setFout] = useState('');
  const [succes, setSucces] = useState('');
  const [bezig, setBezig] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFout('');
    setSucces('');
    if (!form.naam.trim() || !form.email.trim()) {
      setFout('Naam en e-mail zijn verplicht.');
      return;
    }
    setBezig(true);
    try {
      const res = await apiFetch('/api/spelers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Onbekende fout');
      }
      setSucces(`${form.naam} is succesvol ingeschreven!`);
      setForm(leeg);
      onInschrijving();
    } catch (err) {
      setFout(err.message);
    } finally {
      setBezig(false);
    }
  };

  return (
    <div className="card">
      <h2>Nieuwe inschrijving</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="naam">Naam *</label>
            <input id="naam" name="naam" value={form.naam} onChange={handleChange} placeholder="Voor- en achternaam" />
          </div>
          <div className="form-group">
            <label htmlFor="email">E-mail *</label>
            <input id="email" name="email" type="email" value={form.email} onChange={handleChange} placeholder="naam@voorbeeld.be" />
          </div>
          <div className="form-group">
            <label htmlFor="telefoon">Telefoon</label>
            <input id="telefoon" name="telefoon" value={form.telefoon} onChange={handleChange} placeholder="+32 4xx xx xx xx" />
          </div>
        </div>

        <button className="btn btn-primary" type="submit" disabled={bezig}>
          {bezig ? 'Bezig...' : 'Inschrijven'}
        </button>

        {fout && <div className="error-msg">{fout}</div>}
        {succes && <div className="success-msg">{succes}</div>}
      </form>
    </div>
  );
}
