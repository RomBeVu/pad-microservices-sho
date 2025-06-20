const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const cartRoutes = require('./routes/cart');

dotenv.config();

const app = express();
app.use(cors({
  origin: 'http://localhost:3000', // or '*' for all origins (less secure)
  credentials: true
}));
app.use(express.json());
app.use('/cart', cartRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('✅ MongoDB connected');

    app.listen(process.env.PORT, () =>
      console.log(`🚀 Cart service running on port ${process.env.PORT}`)
    );
  })
  .catch(err => console.error('❌ MongoDB connection failed:', err));
