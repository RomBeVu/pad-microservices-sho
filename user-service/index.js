const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const userRoutes = require('./routes/user');
const User = require('./models/User');

dotenv.config();

const app = express();
app.use(cors({
  origin: 'http://localhost:3000', // or '*' for all origins (less secure)
  credentials: true
}));
app.use(express.json());
app.use('/', userRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('✅ MongoDB connected');

    app.listen(process.env.PORT, () =>
      console.log(`🚀 User service running on port ${process.env.PORT}`)
    );
  })
  .catch(err => console.error('❌ MongoDB error', err));
