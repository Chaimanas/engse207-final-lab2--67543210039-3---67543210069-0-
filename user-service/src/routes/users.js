const express = require('express');
const router = express.Router();
const db = require('../db/db.js');
const authMiddleware = require('../middleware/authMiddleware.js');

// GET /api/users/me - ดูโปรไฟล์ตัวเอง (และสร้างให้อัตโนมัติถ้ายังไม่มี)
router.get('/me', authMiddleware, async (req, res) => {
  const { sub, username, email, role } = req.user;

  try {
    // 1. ลองค้นหาโปรไฟล์
    let profile = await db.query('SELECT * FROM user_profiles WHERE user_id = $1', [sub]);

    // 2. ถ้าไม่เจอ ให้สร้างโปรไฟล์เริ่มต้นให้อัตโนมัติ (Auto-create)
    if (profile.rows.length === 0) {
      profile = await db.query(
        `INSERT INTO user_profiles (user_id, username, email, role, display_name) 
         VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [sub, username, email, role, username]
      );
    }

    res.json(profile.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// PUT /api/users/me - แก้ไขโปรไฟล์ตัวเอง
router.put('/me', authMiddleware, async (req, res) => {
  const { display_name, bio, avatar_url } = req.body;
  const { sub } = req.user;

  try {
    const result = await db.query(
      `UPDATE user_profiles 
       SET display_name = $1, bio = $2, avatar_url = $3, updated_at = NOW() 
       WHERE user_id = $4 RETURNING *`,
      [display_name, bio, avatar_url, sub]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Update failed' });
  }
});

// GET /api/users - ดูผู้ใช้ทั้งหมด (Admin Only)
router.get('/', authMiddleware, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden: Admin only' });
  }

  try {
    const result = await db.query('SELECT * FROM user_profiles');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Fetch failed' });
  }
});

module.exports = router;