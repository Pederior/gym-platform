const Comment = require('../models/Comment');
const Article = require('../models/Article');

// --- GET all comments (for admin)
const getAdminComments = async (req, res) => {
  try {
    const { 
      status = 'approved', 
      page = 1, 
      limit = 50,
      search 
    } = req.query;
    
    const query = { status };
    
    if (search) {
      query.$or = [
        { content: { $regex: search, $options: 'i' } }
      ];
    }
    
    const comments = await Comment.find(query)
      .populate('article', 'title')
      .populate('author', 'name email role')
      .populate('parent', 'content author')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Comment.countDocuments(query);
    
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

// --- PUT update comment status (approve/reject)
const updateCommentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: 'وضعیت نامعتبر است' });
    }
    
    const comment = await Comment.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    )
    .populate('article', 'title')
    .populate('author', 'name email role');
    
    if (!comment) {
      return res.status(404).json({ success: false, message: 'کامنت یافت نشد' });
    }
    
    res.json({ success: true, comment });
  } catch (err) {
    res.status(500).json({ success: false, message: 'خطا در به‌روزرسانی کامنت' });
  }
};

// --- DELETE any comment (for admin)
const deleteAnyComment = async (req, res) => {
  try {
    const { id } = req.params;
    
    const comment = await Comment.findByIdAndDelete(id);
    
    if (!comment) {
      return res.status(404).json({ success: false, message: 'کامنت یافت نشد' });
    }
    
    // آپدیت آمار مقاله
    await Article.findByIdAndUpdate(comment.article, {
      $inc: { commentsCount: -1 }
    });
    
    res.json({ success: true, message: 'کامنت با موفقیت حذف شد' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'خطا در حذف کامنت' });
  }
};

// --- POST reply to comment (for admin)
const replyToComment = async (req, res) => {
  try {
    const { parentId, content } = req.body;
    
    if (!parentId || !content?.trim()) {
      return res.status(400).json({ success: false, message: 'اطلاعات ناقص است' });
    }
    
    // پیدا کردن کامنت والد
    const parentComment = await Comment.findById(parentId);
    if (!parentComment) {
      return res.status(404).json({ success: false, message: 'کامنت والد یافت نشد' });
    }
    
    // ایجاد پاسخ
    const reply = await Comment.create({
      content: content.trim(),
      article: parentComment.article,
      author: req.user._id,
      parent: parentId
    });
    
    // آپدیت آمار مقاله
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

module.exports = {
  getAdminComments,
  updateCommentStatus,
  deleteAnyComment,
  replyToComment
};