const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const { pool } = require('./db/db');

const app = express();
app.use(express.json());
app.use(cors());

// routes
app.use('/api/auth', authRoutes);

// root
app.get('/', (req, res) => {
  res.send("AUTH SERVICE OK");
});

// health
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'auth-service' });
});

// ✅ init DB (สำคัญ)
async function initDB() {
  try {
    console.log("Initializing DB...");

    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username TEXT,
        email TEXT UNIQUE,
        password_hash TEXT,
        role TEXT DEFAULT 'member',
        last_login TIMESTAMP
      );
    `);

    console.log("DB initialized ✅");
  } catch (err) {
    console.error("DB init error ❌:", err.message);
  }
}

initDB().catch(console.error);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Auth Service running on port ${PORT}`);
});