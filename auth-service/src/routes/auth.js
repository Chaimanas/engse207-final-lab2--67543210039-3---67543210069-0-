const fetch = require('node-fetch');
const express  = require('express');
const bcrypt   = require('bcryptjs');
const { pool } = require('../db/db');
const { generateToken, verifyToken } = require('../middleware/jwtUtils');

const router = express.Router();

// ── Helper: ส่ง log ไปที่ Log Service ────────────────────────────────
async function logEvent({ service='auth-service', level, event, userId, ip, method, path, statusCode, message, meta }) {
  try {
    // ตรวจสอบชื่อ service ใน docker-compose ว่าชื่อ log-service หรือไม่
    await fetch(`http://log-service:3003/api/logs/internal`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        service, level, event, user_id: userId, ip_address: ip,
        method, path, status_code: statusCode, message, meta
      })
    });
  } catch (_) {
    // ปล่อยผ่านเพื่อให้ระบบหลักทำงานต่อได้แม้ log-service จะล่ม
  }
}

// ── POST /api/auth/register (ลงทะเบียน) ─────────────────────
router.post('/register', async (req, res) => {
  const { username, email, password, role } = req.body;
  const ip = req.headers['x-real-ip'] || req.ip;

  try {
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'กรุณากรอกข้อมูลให้ครบ (username, email, password)' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const result = await pool.query(
      'INSERT INTO users (username, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING id, username, email, role',
      [username, email.toLowerCase().trim(), passwordHash, role || 'member']
    );

    const newUser = result.rows[0];

    await logEvent({
      level: 'INFO', event: 'REGISTER_SUCCESS', userId: newUser.id,
      ip, method: 'POST', path: '/api/auth/register', statusCode: 201,
      message: `User ${newUser.username} registered`
    });

    // ✅ Generate token for new user (same as login)
    const token = generateToken({
      sub: newUser.id,
      username: newUser.username,
      email: newUser.email,
      role: newUser.role
    });

    res.status(201).json({
      message: 'ลงทะเบียนสำเร็จ',
      token,  // ← NOW RETURNS TOKEN!
      user: newUser
    });
  } catch (err) {
    console.error('--- REGISTER ERROR ---', err.message);
    if (err.code === '23505') {
      return res.status(400).json({ error: 'Username หรือ Email นี้ถูกใช้งานแล้ว' });
    }
    res.status(500).json({ 
      error: 'Server error', 
      message: err.message,
      stack: err.stack 
    });
  }
});

// ── POST /api/auth/login (เข้าสู่ระบบ) ───────────────────────────────
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const ip = req.headers['x-real-ip'] || req.ip;

  if (!email || !password) {
    return res.status(400).json({ error: 'กรุณากรอก email และ password' });
  }

  const normalizedEmail = String(email).trim().toLowerCase();

  try {
    const result = await pool.query(
      'SELECT id, username, email, password_hash, role FROM users WHERE email = $1',
      [normalizedEmail]
    );

    const user = result.rows[0];

    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      await logEvent({
        level: 'WARN', event: 'LOGIN_FAILED', userId: user?.id || null,
        ip, method: 'POST', path: '/api/auth/login', statusCode: 401,
        message: `Login failed for: ${normalizedEmail}`
      });
      return res.status(401).json({ error: 'Email หรือ Password ไม่ถูกต้อง' });
    }

    // อัปเดต last_login (ตรวจสอบว่าใน DB มีคอลัมน์นี้ไหม)
    try {
        await pool.query('UPDATE users SET last_login = NOW() WHERE id = $1', [user.id]);
    } catch (e) { console.log('Update last_login skipped'); }

    const token = generateToken({
      sub: user.id,
      username: user.username,
      email: user.email,
      role: user.role
    });

    await logEvent({
      level: 'INFO', event: 'LOGIN_SUCCESS', userId: user.id,
      ip, method: 'POST', path: '/api/auth/login', statusCode: 200,
      message: `User ${user.username} logged in`
    });

    res.json({ message: 'Login สำเร็จ', token, user: { id: user.id, username: user.username, email: user.email, role: user.role } });
  } catch (err) {
    console.error('--- LOGIN ERROR ---', err.message);
    res.status(500).json({ error: 'Server error', message: err.message });
  }
});

// ── GET /api/auth/verify (ตรวจสอบ Token) ──────────────────────────
router.get('/verify', (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ valid: false, error: 'No token' });

  try {
    const decoded = verifyToken(token); 
    res.json({ valid: true, user: decoded });
  } catch (err) {
    res.status(401).json({ valid: false, error: 'Invalid Token', message: err.message });
  }
});

module.exports = router;