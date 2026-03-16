const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');

const app = express();
app.use(express.json());
app.use(cors());

app.use('/api/auth', authRoutes);

app.get('/', (req,res)=>{
  res.send("AUTH SERVICE OK");
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Auth Service running on port ${PORT}`));