const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.JWT_SECRET || 'your-very-secret-key';

// ฟังก์ชันสร้าง Token
const generateToken = (payload) => {
  return jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' });
};

// ฟังก์ชันตรวจสอบ Token
const verifyToken = (token) => {
  return jwt.verify(token, SECRET_KEY);
};

// *** จุดสำคัญ: ต้อง export ออกไปเป็น Object ***
module.exports = { generateToken, verifyToken };