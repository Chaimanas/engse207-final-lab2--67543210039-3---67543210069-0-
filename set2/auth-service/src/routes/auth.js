const express = require('express');
const router = express.Router();

const bcrypt = require('bcryptjs');const pool = require('../db/db');  
const { generateToken } = require('../middleware/jwtUtils');

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ error: 'กรุณากรอก email และ password' });
    }

    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email.toLowerCase()]
    );

    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    const token = generateToken({
      sub: user.id,
      username: user.username,
      email: user.email,
      role: user.role
    });

    res.json({
      message: 'login ok',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router; 