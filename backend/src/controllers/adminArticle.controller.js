const Article = require('../models/Article');
const User = require('../models/User');

// --- GET all articles (for admin)
const getAdminArticles = async (req, res) => {
  try {
    const { 
      status, 
      category, 
      author,
      page = 1, 
      limit = 20,
      search 
    } = req.query;
    
    const query = {};
    
    if (status) query.status = status;
    if (category) query.category = category;
    if (author) query.author = author;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { excerpt: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }
    
    const articles = await Article.find(query)
      .populate('author', 'name email role')
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

// --- GET article by ID (for admin)
const getAdminArticleById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const article = await Article.findById(id)
      .populate('author', 'name email role');
    
    if (!article) {
      return res.status(404).json({ success: false, message: 'مقاله یافت نشد' });
    }
    
    res.json({ success: true, article });
  } catch (err) {
    res.status(500).json({ success: false, message: 'خطا در بارگذاری مقاله' });
  }
};

// --- POST create article (for admin) 
const createArticle = async (req, res) => {
  try {
    const { title, content, excerpt, category, status = 'draft', tags = [], readTime = 5, featuredImage } = req.body;
    
    // اعتبارسنجی
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
      readTime,
      featuredImage
    });
    
    res.status(201).json({ success: true, article });
  } catch (err) {
    console.error('Create article error:', err);
    res.status(500).json({ success: false, message: 'خطا در ایجاد مقاله' });
  }
};

// --- PUT update any article (for admin)
const updateAnyArticle = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const article = await Article.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('author', 'name email role');
    
    if (!article) {
      return res.status(404).json({ success: false, message: 'مقاله یافت نشد' });
    }
    
    res.json({ success: true, article });
  } catch (err) {
    res.status(500).json({ success: false, message: 'خطا در به‌روزرسانی مقاله' });
  }
};

// --- DELETE any article (for admin)
const deleteAnyArticle = async (req, res) => {
  try {
    const { id } = req.params;
    
    const article = await Article.findByIdAndDelete(id);
    
    if (!article) {
      return res.status(404).json({ success: false, message: 'مقاله یافت نشد' });
    }
    
    res.json({ success: true, message: 'مقاله با موفقیت حذف شد' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'خطا در حذف مقاله' });
  }
};

module.exports = {
  getAdminArticles,
  getAdminArticleById,
  createArticle,
  updateAnyArticle,
  deleteAnyArticle
};