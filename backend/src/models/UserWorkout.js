const mongoose = require('mongoose')

const UserWorkoutSchema = new mongoose.Schema({
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
  assignedBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User', // مربی یا مدیر
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'paused'],
    default: 'active'
  },
  assignedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true })

// اطمینان از عدم تکراری بودن
UserWorkoutSchema.index({ user: 1, workout: 1 }, { unique: true })

module.exports = mongoose.model('UserWorkout', UserWorkoutSchema)