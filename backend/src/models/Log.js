const mongoose = require('mongoose')

const LogSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  action: {
    type: String,
    enum: ['login', 'logout', 'create_user', 'delete_user', 'update_settings', 'payment'],
    required: true
  },
  description: String, 
  ip: String, 
  userAgent: String, 
  timestamp: {
    type: Date,
    default: Date.now
  }
}, { timestamps: false })

module.exports = mongoose.model('Log', LogSchema)