const mongoose = require('mongoose');

const DietSchema = new mongoose.Schema({
  name: { type: String, required: true }, // صبحانه، ناهار، شام
  time: { type: String, required: true }, // "08:00", "13:00", "19:00"
  foods: [{
    name: { type: String, required: true },
    portion: { type: String, required: true }, // "2 عدد", "150 گرم"
    calories: { type: Number, default: 0 }
  }],
  notes: { type: String }
});

const DietPlanSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  duration: { type: Number, required: true }, // روز
  diets: [DietSchema],
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('DietPlan', DietPlanSchema);