const { Pool } = require('pg');
console.log("USING DATABASE_URL:", process.env.DATABASE_URL ? "YES" : "NO");
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

module.exports = { pool };