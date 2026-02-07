// models/UserTrainingVideo.js
const mongoose = require('mongoose');

const UserTrainingVideoSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  video: {
    type: mongoose.Schema.ObjectId,
    ref: 'TrainingVideo',
    required: true
  },
  watchedDuration: { type: Number, default: 0 }, // به ثانیه
  isCompleted: { type: Boolean, default: false },
  lastWatchedAt: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('UserTrainingVideo', UserTrainingVideoSchema);