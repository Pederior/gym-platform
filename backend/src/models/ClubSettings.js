const mongoose = require('mongoose')

const settingsSchema = new mongoose.Schema({
  clubName: { type: String, default: 'فینیکس کلاب' },
  address: String,
  phone: String,
  email: String,
  pricing: {
    monthly: { type: Number, default: 150000 },
    quarterly: { type: Number, default: 400000 },
    yearly: { type: Number, default: 1200000 }
  }
})

module.exports = mongoose.model('ClubSettings', settingsSchema)