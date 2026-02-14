const Article = require('../models/Article');
const User = require('../models/User');

// --- GET coach's articles
const getCoachArticles = async (req, res) => {
  try {
    const { status, category, page = 1, limit = 10 } = req.query;
    
    const query = { author: req.user._id };
    if (status) query.status = status;
    if (category) query.category = category;
    
    const articles = await Article.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Article.countDocuments(query);
    
    res.json({ 
      success: true, 
      articles,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'خطا در بارگذاری مقالات' });
  }
};

// --- POST create article
const createArticle = async (req, res) => {
  try {
    const { title, content, excerpt, category, status = 'draft', tags = [], readTime = 5 } = req.body;
    
    if (!title || !content || !excerpt) {
      return res.status(400).json({ success: false, message: 'عنوان، محتوا و خلاصه الزامی هستند' });
    }
    
    const article = await Article.create({
      title,
      content,
      excerpt,
      category,
      status,
      author: req.user._id,
      tags,
      readTime
    });
    
    res.status(201).json({ success: true, article });
  } catch (err) {
    res.status(500).json({ success: false, message: 'خطا در ایجاد مقاله' });
  }
};

// --- GET article by ID for coach
const getCoachArticleById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const article = await Article.findOne({
      _id: id,
      author: req.user._id
    });
    
    if (!article) {
      return res.status(404).json({ success: false, message: 'مقاله یافت نشد' });
    }
    
    res.json({ success: true, article });
  } catch (err) {
    res.status(500).json({ success: false, message: 'خطا در بارگذاری مقاله' });
  }
};

const getPublicArticleById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const article = await Article.findOne({ 
      _id: id, 
      status: 'published' 
    }).populate('author', 'name email avatar');
    
    if (!article) {
      return res.status(404).json({ success: false, message: 'مقاله یافت نشد' });
    }
    
    article.views += 1;
    await article.save();
    
    res.json({ success: true, article });
  } catch (err) {
    res.status(500).json({ success: false, message: 'خطا در بارگذاری مقاله' });
  }
};

// --- PUT update article
const updateArticle = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, excerpt, category, status, tags, readTime, featuredImage } = req.body;
    
    const article = await Article.findOneAndUpdate(
      { _id: id, author: req.user._id },
      { title, content, excerpt, category, status, tags, readTime, featuredImage },
      { new: true, runValidators: true }
    );
    
    if (!article) {
      return res.status(404).json({ success: false, message: 'مقاله یافت نشد' });
    }
    
    res.json({ success: true, article });
  } catch (err) {
    res.status(500).json({ success: false, message: 'خطا در به‌روزرسانی مقاله' });
  }
};

// --- DELETE article
const deleteArticle = async (req, res) => {
  try {
    const { id } = req.params;
    
    const article = await Article.findOneAndDelete({
      _id: id,
      author: req.user._id
    });
    
    if (!article) {
      return res.status(404).json({ success: false, message: 'مقاله یافت نشد' });
    }
    
    res.json({ success: true, message: 'مقاله با موفقیت حذف شد' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'خطا در حذف مقاله' });
  }
};

// --- GET public articles
const getPublicArticles = async (req, res) => {
  try {
    const articles = await Article.find({ status: 'published' })
      .populate('author', 'name email avatar')
      .sort({ createdAt: -1 })
      .limit(20);
    
    res.json({ success: true, articles });
  } catch (err) {
    res.status(500).json({ success: false, message: 'خطا در بارگذاری مقالات' });
  }
};

module.exports = {
  getCoachArticles,
  createArticle,
  getCoachArticleById,     
  getPublicArticleById,     
  updateArticle,
  deleteArticle,
  getPublicArticles
};