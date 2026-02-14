const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    enum: ['subscription', 'order', 'other'],
    default: 'other'
  },
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order'
  },
  subscriptionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subscription'
  },
  method: {
    type: String,
    enum: ['online', 'cash', 'wallet'],
    default: 'online'
  },
  status: {
    type: String,
    enum: ['completed', 'pending', 'failed', 'refunded'],
    default: 'pending'
  },
  description: String,
  transactionId: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Payment', paymentSchema);