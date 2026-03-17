const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');

const app = express();
app.use(express.json());
app.use(cors());

// routes
app.use('/api/auth', authRoutes);

// root
app.get('/', (req, res) => {
  res.send("AUTH SERVICE OK");
});

// health check (สำคัญมากตอน deploy)
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'auth-service' });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Auth Service running on port ${PORT}`);
});