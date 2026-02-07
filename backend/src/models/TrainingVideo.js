const mongoose = require('mongoose');

const TrainingVideoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  videoUrl: { type: String, required: true }, // URL ویدیو (S3, Cloudinary, یا آپلود شده)
  thumbnail: { type: String }, // URL تصویر بندانگشتی
  duration: { type: Number, default: 0 }, // به ثانیه
  category: { 
    type: String, 
    enum: ['nutrition', 'workout', 'lifestyle', 'motivation'],
    default: 'workout'
  },
  accessLevel: {
    type: String,
    enum: ['bronze', 'silver', 'gold'],
    default: 'gold'
  },
  isActive: { type: Boolean, default: true },
  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('TrainingVideo', TrainingVideoSchema);