const express = require('express');
const cors = require('cors');
const authMiddleware = require('./middleware/authMiddleware');
const taskRoutes = require('./routes/tasks');

const app = express();
app.use(express.json());
app.use(cors());

// ใช้ middleware ตรวจ token กับทุก routes ของ tasks
app.use('/api/tasks', authMiddleware, taskRoutes);

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => console.log(`Task Service running on port ${PORT}`));