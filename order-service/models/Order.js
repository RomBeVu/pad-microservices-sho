const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  userId: String,
  items: [
    {
      productId: String,
      quantity: Number,
    },
  ],
  status: {
    type: String,
    enum: ['Placed', 'Shipped', 'Delivered', 'Cancelled'],
    default: 'Placed',
  },
  placedAt: { type: Date, default: Date.now },
  shippedAt: Date,
  deliveredAt: Date,
  CancelledAt: Date
});

module.exports = mongoose.model('Order', OrderSchema);
