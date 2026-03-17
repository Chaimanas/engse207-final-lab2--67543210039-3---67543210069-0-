require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const userRoutes = require('./routes/users');

const app = express();
const PORT = process.env.PORT || 3003;

// ================= DB =================
console.log("USING DATABASE_URL:", process.env.DATABASE_URL ? "YES" : "NO");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

// ทดสอบ DB + สร้าง table
const initDB = async () => {
  try {
    console.log("Initializing DB...");

    await pool.query(`
      CREATE TABLE IF NOT EXISTS user_profiles (
        id SERIAL PRIMARY KEY,
        user_id INTEGER UNIQUE NOT NULL,
        username VARCHAR(50),
        email VARCHAR(100),
        role VARCHAR(20) DEFAULT 'user',
        display_name VARCHAR(100),
        bio TEXT,
        avatar_url VARCHAR(255),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS logs (
        id SERIAL PRIMARY KEY,
        level VARCHAR(10) NOT NULL,
        event VARCHAR(100) NOT NULL,
        user_id INTEGER,
        message TEXT,
        meta JSONB,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    console.log("DB initialized ✅");
  } catch (err) {
    console.error("DB init error ❌", err);
  }
};

// ================= Middleware =================
app.use(cors());
app.use(express.json());

// ================= Routes =================

// root (สำคัญสำหรับ Railway)
app.get('/', (req, res) => {
  res.send('User Service OK');
});

// health check
app.get('/api/users/health', (req, res) => {
  res.json({ status: 'User Service is running' });
});

// user routes
app.use('/api/users', userRoutes);

// ================= Start Server =================
app.listen(PORT, async () => {
  console.log(`User Service running on port ${PORT}`);
  await initDB();
});