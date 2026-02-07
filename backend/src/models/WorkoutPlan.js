const mongoose = require('mongoose')

const ExerciseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  sets: { type: Number, required: true },
  reps: { type: Number, required: true },
  restTime: { type: Number, default: 60 }
})

const WorkoutPlanSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  exercises: [ExerciseSchema],
  duration: { type: Number, required: true },
  isActive: { type: Boolean, default: true },
  assignedTo: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },
}, { timestamps: true })

module.exports = mongoose.model('WorkoutPlan', WorkoutPlanSchema)