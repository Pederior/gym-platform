const Comment = require('../models/Comment');
const Article = require('../models/Article');

// --- GET coach's comments
const getCoachComments = async (req, res) => {
  try {
    const articles = await Article.find({ 
      author: req.user._id,
      status: 'published'
    }).select('_id');
    
    const articleIds = articles.map(article => article._id);
    
    if (articleIds.length === 0) {
      return res.json({ success: true, comments: [] });
    }
    
    const comments = await Comment.find({
      article: { $in: articleIds },
      status: 'approved'
    })
    .populate('article', 'title')
    .populate('author', 'name email')
    .populate('parent', 'content author')
    .sort({ createdAt: -1 });
    
    res.json({ success: true, comments });
  } catch (err) {
    res.status(500).json({ success: false, message: 'خطا در بارگذاری کامنت‌ها' });
  }
};

// --- POST reply to comment (for coach)
const replyToComment = async (req, res) => {
  try {
    const { parentId, content } = req.body;
    
    if (!parentId || !content?.trim()) {
      return res.status(400).json({ success: false, message: 'اطلاعات ناقص است' });
    }
    
    const parentComment = await Comment.findById(parentId);
    if (!parentComment) {
      return res.status(404).json({ success: false, message: 'کامنت والد یافت نشد' });
    }
    
    const article = await Article.findById(parentComment.article);
    if (!article || article.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'دسترسی غیرمجاز' });
    }
    
    const reply = await Comment.create({
      content: content.trim(),
      article: parentComment.article,
      author: req.user._id,
      parent: parentId
    });
    
    await Article.findByIdAndUpdate(parentComment.article, {
      $inc: { commentsCount: 1 },
      lastCommentAt: new Date()
    });
    
    const populatedReply = await Comment.findById(reply._id)
      .populate('author', 'name email avatar')
      .populate('parent', 'author content');
    
    res.status(201).json({ success: true, comment: populatedReply });
  } catch (err) {
    res.status(500).json({ success: false, message: 'خطا در ایجاد پاسخ' });
  }
};

// --- DELETE coach's comment
const deleteCoachComment = async (req, res) => {
  try {
    const { id } = req.params;
    
    const comment = await Comment.findById(id);
    if (!comment) {
      return res.status(404).json({ success: false, message: 'کامنت یافت نشد' });
    }
    
    const article = await Article.findById(comment.article);
    if (!article || article.author.toString() !== req.user._id.toString()) {
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
  getCoachComments,
  replyToComment,
  deleteCoachComment
};