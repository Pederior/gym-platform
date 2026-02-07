const mongoose = require('mongoose');

const UserDietPlanSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  dietPlan: {
    type: mongoose.Schema.ObjectId,
    ref: 'DietPlan',
    required: true
  },
  assignedBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'paused'],
    default: 'active'
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  progress: {
    completedDays: { type: Number, default: 0 },
    totalDays: { type: Number, required: true }
  }
}, { timestamps: true });

module.exports = mongoose.model('UserDietPlan', UserDietPlanSchema);