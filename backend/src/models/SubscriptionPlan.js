const mongoose = require('mongoose');

const SubscriptionPlanSchema = new mongoose.Schema({
  id: {
    type: String,
    enum: ['bronze', 'silver', 'gold'],
    required: true,
    unique: true
  },
  name: { type: String, required: true },
  description: { type: String, required: true },
  isPopular: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  features: [{ type: String }],
  price: {
    monthly: { type: Number, required: true, min: 0 },
    quarterly: { type: Number, required: true, min: 0 },
    yearly: { type: Number, required: true, min: 0 }
  },
  order: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('SubscriptionPlan', SubscriptionPlanSchema);