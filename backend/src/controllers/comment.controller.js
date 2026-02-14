const Comment = require('../models/Comment');
const Article = require('../models/Article');
const User = require('../models/User');

// --- POST create comment
const createComment = async (req, res) => {
  try {
    const { articleId, content, parentId = null } = req.body;
    
    const article = await Article.findById(articleId);
    if (!article || article.status !== 'published') {
      return res.status(404).json({ success: false, message: 'مقاله یافت نشد' });
    }
    
    if (parentId) {
      const parentComment = await Comment.findById(parentId);
      if (!parentComment || parentComment.article.toString() !== articleId) {
        return res.status(400).json({ success: false, message: 'کامنت والد نامعتبر است' });
      }
    }
    
    const comment = await Comment.create({
      content,
      article: articleId,
      author: req.user._id,
      parent: parentId
    });
    
    await Article.findByIdAndUpdate(articleId, {
      $inc: { commentsCount: 1 },
      lastCommentAt: new Date()
    });
    
    const populatedComment = await Comment.findById(comment._id)
      .populate('author', 'name email avatar')
      .populate('parent', 'author content');
    
    res.status(201).json({ success: true, comment: populatedComment });
  } catch (err) {
    res.status(500).json({ success: false, message: 'خطا در ایجاد کامنت' });
  }
};

// --- GET comments for article
const getArticleComments = async (req, res) => {
  try {
    const { articleId } = req.params;
    const { page = 1, limit = 20 } = req.query;
    
    const article = await Article.findById(articleId);
    if (!article) {
      return res.status(404).json({ success: false, message: 'مقاله یافت نشد' });
    }
    
    const comments = await Comment.find({
      article: articleId,
      status: 'approved'
    })
    .populate('author', 'name email avatar role')
    .populate('parent', 'author content')
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);
    
    const total = await Comment.countDocuments({
      article: articleId,
      status: 'approved'
    });
    
    res.json({ 
      success: true, 
      comments,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'خطا در بارگذاری کامنت‌ها' });
  }
};

// --- PUT like comment
const likeComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ success: false, message: 'کامنت یافت نشد' });
    }
    
    const alreadyLiked = comment.likes.includes(req.user._id);
    
    if (alreadyLiked) {
      comment.likes = comment.likes.filter(id => id.toString() !== req.user._id.toString());
    } else {
      comment.likes.push(req.user._id);
    }
    
    await comment.save();
    
    res.json({ 
      success: true, 
      liked: !alreadyLiked,
      likesCount: comment.likes.length 
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'خطا در لایک کامنت' });
  }
};

// --- DELETE comment (فقط صاحب کامنت یا ادمین)
const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ success: false, message: 'کامنت یافت نشد' });
    }
    
    if (req.user.role !== 'admin' && comment.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'دسترسی غیرمجاز' });
    }
    
    await comment.deleteOne();
    
    await Article.findByIdAndUpdate(comment.article, {
      $inc: { commentsCount: -1 }
    });
    
    res.json({ success: true, message: 'کامنت با موفقیت حذف شد' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'خطا در حذف کامنت' });
  }
};

module.exports = {
  createComment,
  getArticleComments,
  likeComment,
  deleteComment
};