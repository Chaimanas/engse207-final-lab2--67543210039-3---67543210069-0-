const { Pool } = require('pg');

// ดึงค่าจาก environment variables ที่เราตั้งไว้ใน docker-compose
const pool = new Pool({
  host: process.env.DB_HOST || 'postgres',
  user: process.env.DB_USER || 'admin',
  password: process.env.DB_PASSWORD || 'secret123',
  database: process.env.DB_NAME || 'taskboard',
  port: process.env.DB_PORT || 5432,
});

// ตรวจสอบการเชื่อมต่อ (เอาไว้ดูใน logs)
pool.on('connect', () => {
  console.log('[Task-DB] Connected to PostgreSQL');
});

pool.on('error', (err) => {
  console.error('[Task-DB] Unexpected error on idle client', err);
});

module.exports = { pool };