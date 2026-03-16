const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/users.js'); // ดึงไฟล์ route มาใช้

const app = express(); // *** ต้องมีบรรทัดนี้ก่อนเรียกใช้ app.get หรือ app.use ***
const PORT = process.env.PORT || 3003;

app.use(cors());
app.use(express.json());

// เชื่อมต่อเส้นทาง API (ซึ่งข้างในไฟล์ users.js จะใช้ router แทน app)
app.use('/api/users', userRoutes);

// Health Check
app.get('/api/users/health', (req, res) => {
  res.json({ status: 'User Service is running' });
});

app.listen(PORT, () => {
  console.log(`User Service running on port ${PORT}`);
});