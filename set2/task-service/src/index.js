require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { initDB } = require('./db/db');

const app = express();

app.use(cors());
app.use(express.json());

console.log("USING DATABASE_URL:", process.env.DATABASE_URL ? "YES" : "NO");


app.get('/health', (req, res) => {
  res.send("Task Service OK");
});

app.use('/api/tasks', require('./routes/tasks'));

const PORT = process.env.PORT || 3002;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Task Service running on port ${PORT}`);
});