const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const path = require('path');

const adapter = new FileSync(path.join(__dirname, 'padel.json'));
const db = low(adapter);

db.defaults({ spelers: [], nextId: 1 }).write();

const getAllSpelers = () => db.get('spelers').orderBy('created_at', 'desc').value();

const addSpeler = ({ naam, email, telefoon, partner_naam, partner_email }) => {
  const id = db.get('nextId').value();
  const speler = {
    id,
    naam,
    email,
    telefoon: telefoon || null,
    partner_naam: partner_naam || null,
    partner_email: partner_email || null,
    created_at: new Date().toISOString(),
  };
  db.get('spelers').push(speler).write();
  db.set('nextId', id + 1).write();
  return speler;
};

const deleteSpeler = (id) => {
  db.get('spelers').remove({ id: parseInt(id) }).write();
};

module.exports = { getAllSpelers, addSpeler, deleteSpeler };
