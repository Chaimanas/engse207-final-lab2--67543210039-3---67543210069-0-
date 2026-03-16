const express = require('express');
const { pool } = require('../db/db');
const router = express.Router();

// GET Tasks
router.get('/', async (req, res) => {
  try {
    const userId = req.user.id || req.user.sub;
    let result;

    if (req.user.role === 'admin') {
      result = await pool.query('SELECT * FROM tasks ORDER BY created_at DESC');
    } else {
      result = await pool.query('SELECT * FROM tasks WHERE user_id = $1 ORDER BY created_at DESC', [userId]);
    }
    
    // ส่งกลับพร้อม username จำลอง (เพราะเราไม่ได้ JOIN)
    const tasks = result.rows.map(t => ({ ...t, username: t.username || 'User' }));
    res.json({ tasks, count: result.rowCount });
  } catch (err) {
    console.error('🔥 DB Error (GET):', err.message);
    res.status(500).json({ error: 'Database error' });
  }
});

// POST Task
router.post('/', async (req, res) => {
  const { title, description, status = 'TODO' } = req.body;
  if (!title) return res.status(400).json({ error: 'title is required' });

  const userId = req.user.id || req.user.sub;

  try {
    const result = await pool.query(
      `INSERT INTO tasks (user_id, title, description, status)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [userId, title, description, status.toUpperCase()]
    );
    res.status(201).json({ task: result.rows[0] });
  } catch (err) {
    console.error('🔥 DB Error (POST):', err.message);
    res.status(500).json({ error: 'Database error' });
  }
});

module.exports = router;