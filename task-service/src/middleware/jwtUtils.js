const jwt = require('jsonwebtoken');

exports.verifyToken = (token) => {
  try {
    // ลองเช็คดูว่า process.env.JWT_SECRET มีค่าไหม
    if (!process.env.JWT_SECRET) {
      console.error("❌ JWT_SECRET is undefined in Task Service!");
    }
    return jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret'); 
  } catch (err) {
    console.error("🔥 JWT Verify Failed:", err.message); // ดูใน Docker Logs จะเห็นสาเหตุ
    throw err;
  }
};