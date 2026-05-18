const express = require('express');
const cors = require('cors');
const { Parser } = require('json2csv');
const { init, getAllSpelers, addSpeler, deleteSpeler } = require('./database');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://corneeboorsma.github.io',
  ],
}));
app.use(express.json());

app.get('/api/spelers', async (req, res) => {
  try {
    res.json(await getAllSpelers());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/spelers', async (req, res) => {
  const { naam, email, telefoon } = req.body;
  if (!naam || !email) {
    return res.status(400).json({ error: 'Naam en e-mail zijn verplicht.' });
  }
  try {
    const speler = await addSpeler({ naam, email, telefoon });
    res.status(201).json(speler);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/spelers/:id', async (req, res) => {
  try {
    await deleteSpeler(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/spelers/export', async (req, res) => {
  try {
    const spelers = await getAllSpelers();
    const fields = [
      { label: 'ID', value: 'id' },
      { label: 'Naam', value: 'naam' },
      { label: 'E-mail', value: 'email' },
      { label: 'Telefoon', value: 'telefoon' },
      { label: 'Inschrijfdatum', value: 'created_at' },
    ];
    const parser = new Parser({ fields });
    const csv = parser.parse(spelers);
    res.header('Content-Type', 'text/csv');
    res.attachment('inschrijvingen.csv');
    res.send(csv);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

init()
  .then(() => app.listen(PORT, () => console.log(`Padel backend draait op poort ${PORT}`)))
  .catch(err => { console.error('Database init mislukt:', err); process.exit(1); });
