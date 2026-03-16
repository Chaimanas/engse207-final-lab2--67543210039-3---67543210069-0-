const { verifyToken } = require('./jwtUtils');

module.exports = function requireAuth(req, res, next) {
  const header = req.headers['authorization'] || '';
  const token  = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    console.log("❌ [Auth] No token provided in headers");
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  try {
    const decoded = verifyToken(token);
    req.user = decoded; // เก็บข้อมูล user ไว้ใน req
    console.log(`✅ [Auth] User ${decoded.username || decoded.sub} Authorized`);
    next();
  } catch (err) {
    console.error("🔥 [Auth] JWT Verify Failed:", err.message);
    return res.status(401).json({ error: 'Unauthorized: ' + err.message });
  }
};