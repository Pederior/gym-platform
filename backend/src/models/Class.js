const mongoose = require('mongoose')

const ClassSchema = new mongoose.Schema({
  title: { type: String, required: true },
  coach: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  dateTime: { type: Date, required: true },
  capacity: { type: Number, required: true, min: 1 },
  reservedBy: [{
    user: { type: mongoose.Schema.ObjectId, ref: 'User' },
    reservedAt: { type: Date, default: Date.now }
  }],
  price: { type: Number, required: true, min: 0 },
  description: String
}, { timestamps: true })

module.exports = mongoose.model('Class', ClassSchema)