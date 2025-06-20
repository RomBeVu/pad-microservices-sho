const router = require('express').Router();
const Cart = require('../models/Cart');
const redisClient = require('../utils/redisClient');
const authMiddleware = require('../middlewares/authMiddleware');
// GET CART
router.get('/:userId', authMiddleware, async (req, res) => {
  const key = `cart:${req.params.userId}`;
  const cached = await redisClient.get(key);
  if (cached) return res.json(JSON.parse(cached));

  const cart = await Cart.findOne({ userId: req.params.userId });
  if (!cart) return res.json({ userId: req.params.userId, items: [] });

  await redisClient.set(key, JSON.stringify(cart), { EX: 3600 });
  res.json(cart);
});

// ADD ITEM
router.post('/:userId/add', authMiddleware, async (req, res) => {
  const { productId, quantity } = req.body;

  let cart = await Cart.findOne({ userId: req.params.userId });
  if (!cart) {
    cart = new Cart({ userId: req.params.userId, items: [{ productId, quantity }] });
  } else {
    const item = cart.items.find(i => i.productId === productId);
    if (item) item.quantity += quantity;
    else cart.items.push({ productId, quantity });
  }

  await cart.save();
  await redisClient.set(`cart:${req.params.userId}`, JSON.stringify(cart), { EX: 3600 });

  res.json(cart);
});

// REMOVE ITEM
router.post('/:userId/remove', authMiddleware, async (req, res) => {
  const { productId } = req.body;
  let cart = await Cart.findOne({ userId: req.params.userId });
  if (!cart) return res.status(404).json({ message: 'Cart not found' });

  cart.items = cart.items.filter(i => i.productId !== productId);
  await cart.save();
  await redisClient.set(`cart:${req.params.userId}`, JSON.stringify(cart), { EX: 3600 });

  res.json(cart);
});

// CLEAR CART
router.post('/:userId/clear', authMiddleware, async (req, res) => {
  await Cart.deleteOne({ userId: req.params.userId });
  await redisClient.del(`cart:${req.params.userId}`);
  res.json({ message: 'Cart cleared' });
});

// CHECKOUT (emit event)
router.post('/:userId/checkout', authMiddleware, async (req, res) => {
  const cart = await Cart.findOne({ userId: req.params.userId });
  if (!cart || cart.items.length === 0) return res.status(400).json({ message: 'Cart is empty' });

  await Cart.deleteOne({ userId: req.params.userId });
  await redisClient.del(`cart:${req.params.userId}`);

  res.json({ message: 'Checkout successful', cart });
});

module.exports = router;
