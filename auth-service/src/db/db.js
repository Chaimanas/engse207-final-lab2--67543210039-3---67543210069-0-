const { Pool } = require('pg');

const pool = new Pool({
  host:     process.env.DB_HOST || 'postgres',
  port:     5432,
  database: 'taskboard',      // ใส่ชื่อ DB ตรงๆ
  user:     'admin',          // ใส่ Username ตรงๆ
  password: 'secret123',      // ใส่ Password ตรงๆ
});

module.exports = { pool };