const jwt = require('jsonwebtoken');

// ดึงกุญแจจาก .env ถ้าไม่มีให้ใช้ค่า Default (ต้องตรงกันทุก Service)
const secret = process.env.JWT_SECRET || 'engse207-super-secret-change-in-production-abc123';
const expires = process.env.JWT_EXPIRES || '1h';

/**
 * สร้าง Token เมื่อ Login สำเร็จ
 */
function generateToken(payload) {
  return jwt.sign(payload, secret, { expiresIn: expires });
}

/**
 * ตรวจสอบ Token ที่ส่งมาจาก Frontend
 */
function verifyToken(token) {
  try {
    return jwt.verify(token, secret);
  } catch (err) {
    throw new Error(err.message);
  }
}

module.exports = {
  generateToken,
  verifyToken,
  secret // export ไว้เผื่อต้องใช้ในจุดอื่น
};