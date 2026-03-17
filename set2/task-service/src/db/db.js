const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});
screen
const initDB = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS tasks (
        id SERIAL PRIMARY KEY,
        user_id INT,
        title TEXT NOT NULL,
        description TEXT,
        status TEXT DEFAULT 'TODO',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('DB initialized ✅');
  } catch (err) {
    console.error('DB init error:', err);
  }
};

initDB();

module.exports = { pool };