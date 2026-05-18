const express = require('express');
const cors = require('cors');
const { Parser } = require('json2csv');
const { getAllSpelers, addSpeler, deleteSpeler } = require('./database');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.get('/api/spelers', (req, res) => {
  res.json(getAllSpelers());
});

app.post('/api/spelers', (req, res) => {
  const { naam, email, telefoon, partner_naam, partner_email } = req.body;
  if (!naam || !email) {
    return res.status(400).json({ error: 'Naam en e-mail zijn verplicht.' });
  }
  const result = addSpeler({ naam, email, telefoon: telefoon || null, partner_naam: partner_naam || null, partner_email: partner_email || null });
  res.status(201).json({ id: result.lastInsertRowid });
});

app.delete('/api/spelers/:id', (req, res) => {
  deleteSpeler(req.params.id);
  res.status(204).send();
});

app.get('/api/spelers/export', (req, res) => {
  const spelers = getAllSpelers();
  const fields = [
    { label: 'ID', value: 'id' },
    { label: 'Naam', value: 'naam' },
    { label: 'E-mail', value: 'email' },
    { label: 'Telefoon', value: 'telefoon' },
    { label: 'Partner naam', value: 'partner_naam' },
    { label: 'Partner e-mail', value: 'partner_email' },
    { label: 'Inschrijfdatum', value: 'created_at' },
  ];
  const parser = new Parser({ fields });
  const csv = parser.parse(spelers);
  res.header('Content-Type', 'text/csv');
  res.attachment('inschrijvingen.csv');
  res.send(csv);
});

app.listen(PORT, () => console.log(`Padel backend draait op http://localhost:${PORT}`));
