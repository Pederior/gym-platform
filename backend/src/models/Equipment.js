const mongoose = require('mongoose')

const EquipmentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true }, 
  status: { 
    type: String, 
    enum: ['available', 'reserved', 'maintenance'], 
    default: 'available' 
  }
}, { timestamps: true })

module.exports = mongoose.model('Equipment', EquipmentSchema)