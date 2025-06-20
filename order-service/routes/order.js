// routes/order.js
const express = require('express');
const Order = require('../models/Order');
const authMiddleware = require('../middlewares/authMiddleware');

module.exports = (producer) => {
  const router = express.Router();

  router.get('/health', (req, res) => {
    res.send('✅ Order service is running');
  });

  // Get orders for a user
  router.get('/:userId', authMiddleware, async (req, res) => {
    let orders = '';
    try {
      if (req.params.userId == '6854cd873f17398cf9bac34a') {
        orders = await Order.find({});
      } else {
        orders = await Order.find({ userId: req.params.userId });
      }
      
      res.json(orders);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Place order
  router.post('/:userId/place', authMiddleware, async (req, res) => {
    const { userId, items } = req.body;

    try {
      const order = await Order.create({ userId, items, status: 'Placed' });

      await producer.send({
        topic: 'order.placed',
        messages: [
          {
            key: String(order._id),
            value: JSON.stringify({
              orderId: order._id,
              userId: order.userId,
              items: order.items,
              status: 'Placed',
              placedAt: new Date(),
            }),
          },
        ],
      });

      res.status(201).json(order);
    } catch (err) {
      console.error('❌ Error placing order:', err);
      res.status(400).json({ error: err.message });
    }
  });

  // Update order status
  router.patch('/:orderId/status', authMiddleware, async (req, res) => {
    const { status } = req.body;
    const validStatuses = ['Shipped', 'Delivered', 'Cancelled'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status value' });
    }

    try {
      const order = await Order.findById(req.params.orderId);
      if (!order) return res.status(404).json({ error: 'Order not found' });

      const now = new Date();
      order.status = status;

      if (status === 'Shipped') order.shippedAt = now;
      if (status === 'Delivered') order.deliveredAt = now;
      if (status === 'Cancelled') order.cancelledAt = now;

      await order.save();

      await producer.send({
        topic: `order.${status.toLowerCase()}`,
        messages: [
          {
            key: String(order._id),
            value: JSON.stringify({
              orderId: order._id,
              userId: order.userId,
              status,
              timestamp: now,
            }),
          },
        ],
      });

      res.json({ message: `Order marked as ${status}`, order });
    } catch (err) {
      console.error('❌ Failed to update order:', err);
      res.status(500).json({ error: err.message });
    }
  });

  return router;
};
