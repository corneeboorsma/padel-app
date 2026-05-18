const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

const init = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS spelers (
      id SERIAL PRIMARY KEY,
      naam TEXT NOT NULL,
      email TEXT NOT NULL,
      telefoon TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);
};

const getAllSpelers = async () => {
  const { rows } = await pool.query('SELECT * FROM spelers ORDER BY created_at DESC');
  return rows;
};

const addSpeler = async ({ naam, email, telefoon }) => {
  const { rows } = await pool.query(
    'INSERT INTO spelers (naam, email, telefoon) VALUES ($1, $2, $3) RETURNING *',
    [naam, email, telefoon || null]
  );
  return rows[0];
};

const deleteSpeler = async (id) => {
  await pool.query('DELETE FROM spelers WHERE id = $1', [id]);
};

module.exports = { init, getAllSpelers, addSpeler, deleteSpeler };
