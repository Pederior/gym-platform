const mongoose = require('mongoose')

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  type: { 
    type: String, 
    enum: ['supplement', 'clothing', 'accessory', 'digital'],
    required: true 
  },
  category: { type: String, required: true },
  description: { type: String, required: true },
  image: String,
  compatiblePlans: [{
    type: String,
    enum: ['bronze', 'silver', 'gold']
  }],
  bundles: [String],
  status: { type: String, default: 'active' }
});

module.exports = mongoose.model('Product', ProductSchema)