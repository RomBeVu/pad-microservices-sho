const router = require('express').Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const redisClient = require('../utils/redisClient');

const JWT_SECRET = process.env.JWT_SECRET;

// Signup
router.post('/signup', async (req, res) => {
  console.log(`[AUTH-SERVICE] Received signup request with body:`, req.body);
  try {
    const { username, email, password } = req.body;

    // Add validation
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Username, email, and password are required' });
    }

    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ username, email, password: hash });

    res.status(201).json({ message: 'User created', userId: user._id });
  } catch (err) {
    console.error('[AUTH-SERVICE] Signup error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Signin
router.post('/signin', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid email' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: 'Invalid password' });

    const token = jwt.sign({ userId: user._id, username: user.username}, JWT_SECRET, { expiresIn: '1h' });

    // Cache token in Redis
    await redisClient.set(`auth:token:${user._id}`, token, { EX: 3600 });

    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Logout
router.post('/logout', async (req, res) => {
  try {
    const { userId } = req.body;
    await redisClient.del(`auth:token:${userId}`);
    res.json({ message: 'Logged out' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
