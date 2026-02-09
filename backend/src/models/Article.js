const mongoose = require('mongoose');

const ArticleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'عنوان الزامی است'],
    trim: true
  },
  content: {
    type: String,
    required: [true, 'محتوا الزامی است']
  },
  excerpt: {
    type: String,
    required: [true, 'خلاصه الزامی است'],
    maxlength: [200, 'خلاصه نباید بیشتر از 200 کاراکتر باشد']
  },
  category: {
    type: String,
    enum: ['nutrition', 'workout', 'lifestyle', 'motivation', 'health'],
    default: 'health'
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  },
  author: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  featuredImage: {
    type: String,
    default: null
  },
  tags: [{
    type: String,
    trim: true
  }],
  readTime: {
    type: Number,
    default: 5
  },
  views: {
    type: Number,
    default: 0
  },
  commentsCount: {
    type: Number,
    default: 0
  },
  lastCommentAt: {
    type: Date,
    default: null
  }
}, { timestamps: true });

// Index برای جستجوی بهتر
ArticleSchema.index({ title: 'text', content: 'text', tags: 'text' });

module.exports = mongoose.model('Article', ArticleSchema);