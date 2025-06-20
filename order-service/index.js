// index.js
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const { connectProducer, producer } = require('./kafkaClient');
const { runConsumer } = require('./orderStatusConsumer');

dotenv.config();

const app = express();
const server = http.createServer(app); // HTTP server for Socket.IO
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

app.set('io', io);

io.on('connection', (socket) => {
  console.log('📡 WebSocket client connected');
});

// Middlewares
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());

// Mongo + Kafka + Start server
mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('✅ MongoDB connected');

    // Connect Kafka producer
    await connectProducer();

    // Dynamically require routes after Kafka is ready
    const orderRoutes = require('./routes/order')(producer);
    app.use('/orders', orderRoutes);

    // Start Kafka consumer
    runConsumer(io);

    // Start Express server
    server.listen(process.env.PORT, () => {
      console.log(`🚀 Order service with WebSocket running on port ${process.env.PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ MongoDB connection failed:', err);
  });
