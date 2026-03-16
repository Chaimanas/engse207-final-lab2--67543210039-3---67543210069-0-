const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST || 'task-db',
  user: process.env.DB_USER || 'admin',
  password: process.env.DB_PASSWORD || 'admin123',
  database: process.env.DB_NAME || 'taskdb',
  port: 5432,
});

// เช็ค Connection ทันที
pool.query('SELECT NOW()', (err, res) => {
  if (err) console.error('❌ Database Connection Failed:', err.message);
  else console.log('✅ Database Connected to TaskDB');
});

module.exports = { pool };