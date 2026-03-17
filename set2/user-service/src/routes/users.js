const express = require('express');
const router = express.Router();
const { pool } = require('../db/db');
const authMiddleware = require('../middleware/authMiddleware.js');

// =====================
// ✅ GET PROFILE (AUTO CREATE)
// =====================
router.get('/me', authMiddleware, async (req, res) => {
  const { sub, username, email, role } = req.user;

  try {
    let profile = await pool.query(
      'SELECT * FROM user_profiles WHERE user_id = $1',
      [sub]
    );

    if (profile.rows.length === 0) {
      profile = await pool.query(
        `INSERT INTO user_profiles 
        (user_id, username, email, role, display_name) 
        VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [sub, username, email, role, username]
      );
    }

    res.json(profile.rows[0]);
  } catch (err) {
    console.error('🔥 DB Error (ME):', err.message);
    res.status(500).json({ error: 'Database error' });
  }
});


// =====================
// ✅ UPDATE PROFILE
// =====================
router.put('/me', authMiddleware, async (req, res) => {
  const { display_name, bio, avatar_url } = req.body;
  const { sub } = req.user;

  try {
    const result = await pool.query(
      `UPDATE user_profiles 
       SET display_name = $1, 
           bio = $2, 
           avatar_url = $3, 
           updated_at = NOW()
       WHERE user_id = $4 RETURNING *`,
      [display_name, bio, avatar_url, sub]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error('🔥 DB Error (UPDATE):', err.message);
    res.status(500).json({ error: 'Update failed' });
  }
});


// =====================
// ✅ GET ALL USERS (ADMIN)
// =====================
router.get('/', authMiddleware, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden: Admin only' });
  }

  try {
    const result = await pool.query('SELECT * FROM user_profiles');
    res.json(result.rows);
  } catch (err) {
    console.error('🔥 DB Error (GET ALL):', err.message);
    res.status(500).json({ error: 'Fetch failed' });
  }
});

module.exports = router;