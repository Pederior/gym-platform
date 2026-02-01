// models/UserProgress.js

const mongoose = require('mongoose')

const UserProgressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  workout: {
    type: mongoose.Schema.ObjectId,
    ref: 'WorkoutPlan',
    required: true
  },
  completedDays: {
    type: Number,
    default: 0
  },
  totalDays: {
    type: Number,
    required: true
  },
  lastActivity: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'paused'],
    default: 'active'
  }
}, { timestamps: true })

// ایندکس برای بهینه‌سازی کوئری‌ها
UserProgressSchema.index({ user: 1, workout: 1 }, { unique: true })

module.exports = mongoose.model('UserProgress', UserProgressSchema)