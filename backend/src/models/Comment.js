const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
  content: {
    type: String,
    required: [true, 'محتوای کامنت الزامی است'],
    maxlength: [500, 'کامنت نباید بیشتر از 500 کاراکتر باشد']
  },
  article: {
    type: mongoose.Schema.ObjectId,
    ref: 'Article',
    required: true
  },
  author: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  parent: {
    type: mongoose.Schema.ObjectId,
    ref: 'Comment',
    default: null
  },
  likes: [{
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  }],
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'approved' 
  }
}, { timestamps: true });

CommentSchema.index({ article: 1, status: 1, createdAt: -1 });
CommentSchema.index({ author: 1 });

module.exports = mongoose.model('Comment', CommentSchema);