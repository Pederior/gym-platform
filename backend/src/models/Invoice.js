const mongoose = require('mongoose')

const InvoiceSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
  subscription: { type: mongoose.Schema.ObjectId, ref: 'Subscription' },
  items: [{
    description: String,
    amount: Number,
    quantity: { type: Number, default: 1 }
  }],
  totalAmount: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['paid', 'unpaid', 'overdue'], 
    default: 'unpaid' 
  },
  dueDate: { type: Date, required: true }
}, { timestamps: true })

module.exports = mongoose.model('Invoice', InvoiceSchema)