const router = require('express').Router();
const User = require('../models/User');
const redisClient = require('../utils/redisClient');
const authMiddleware = require('../middlewares/authMiddleware');

// Get profile
router.get('/me', authMiddleware, async (req, res) => {
  const userId = req.user.userId;

  const cacheKey = `user:${userId}`;
  let userData = await redisClient.get(cacheKey);

  if (userData) {
    return res.json(JSON.parse(userData));
  }

  const user = await User.findById(userId);
  if (!user) return res.status(404).json({ message: 'User not found' });

  await redisClient.set(cacheKey, JSON.stringify(user), { EX: 3600 });
  res.json(user);
});

// Update profile
router.put('/me', authMiddleware, async (req, res) => {
  const userId = req.user.userId;
  const { username } = req.body;

  const updatedUser = await User.findByIdAndUpdate(userId, { username }, { new: true });
  await redisClient.set(`user:${userId}`, JSON.stringify(updatedUser), { EX: 3600 });

  res.json(updatedUser);
});

module.exports = router;
