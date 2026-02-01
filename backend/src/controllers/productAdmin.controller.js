const Product = require('../models/Product');
const multer = require('multer');
const path = require('path');

// Configure multer for image upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/products/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('فقط فایل‌های تصویری مجاز هستند'));
  }
};

exports.upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: fileFilter
});

// @desc    Get all products with admin filters
// @route   GET /api/admin/products
// @access  Admin
exports.getProducts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = '',
      type,
      category,
      status,
      sortBy = 'createdAt',
      order = 'desc'
    } = req.query;

    // Build query
    let query = {};

    // Search by name or category
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } }
      ];
    }

    // Filter by type
    if (type) {
      query.type = type;
    }

    // Filter by category
    if (category) {
      query.category = category;
    }

    // Filter by status
    if (status) {
      query.status = status;
    }

    // Count total
    const total = await Product.countDocuments(query);

    // Sort options
    const sortOptions = {};
    sortOptions[sortBy] = order === 'asc' ? 1 : -1;

    // Get products
    const products = await Product.find(query)
      .sort(sortOptions)
      .limit(parseInt(limit))
      .skip((page - 1) * limit);

    res.json({
      success: true,
      products,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit),
      limit: parseInt(limit)
    });
  } catch (error) {
    console.error('Error in getProducts:', error);
    res.status(500).json({ success: false, message: 'خطا در دریافت محصولات' });
  }
};

// @desc    Get single product
// @route   GET /api/admin/products/:id
// @access  Admin
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'محصول یافت نشد' });
    }

    res.json({ success: true, product });
  } catch (error) {
    console.error('Error in getProductById:', error);
    res.status(500).json({ success: false, message: 'خطا در دریافت محصول' });
  }
};

// @desc    Create product
// @route   POST /api/admin/products
// @access  Admin
exports.createProduct = async (req, res) => {
  try {
    const {
      name,
      price,
      type,
      category,
      description,
      compatiblePlans,
      bundles,
      status = 'active'
    } = req.body;

    // Validate required fields
    if (!name || !price || !type || !category || !description) {
      return res.status(400).json({ 
        success: false, 
        message: 'لطفاً تمام فیلدهای اجباری (نام، قیمت، نوع، دسته‌بندی، توضیحات) را پر کنید' 
      });
    }

    // Handle image upload
    let image = '';
    if (req.file) {
      const baseUrl = `${req.protocol}://${req.get('host')}`;
      image = `${baseUrl}/uploads/products/${req.file.filename}`;
    }

    // Parse arrays if they are strings
    let parsedCompatiblePlans = [];
    let parsedBundles = [];

    if (compatiblePlans) {
      parsedCompatiblePlans = typeof compatiblePlans === 'string' 
        ? JSON.parse(compatiblePlans) 
        : compatiblePlans;
    }

    if (bundles) {
      parsedBundles = typeof bundles === 'string' 
        ? JSON.parse(bundles) 
        : bundles;
    }

    // Create product
    const product = await Product.create({
      name,
      price: Number(price),
      type,
      category,
      description,
      image,
      compatiblePlans: parsedCompatiblePlans,
      bundles: parsedBundles,
      status
    });

    res.status(201).json({ 
      success: true, 
      message: 'محصول با موفقیت ایجاد شد',
      product 
    });
  } catch (error) {
    console.error('Error in createProduct:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ success: false, message: error.message });
    }
    res.status(500).json({ success: false, message: 'خطا در ایجاد محصول' });
  }
};

// @desc    Update product
// @route   PUT /api/admin/products/:id
// @access  Admin
exports.updateProduct = async (req, res) => {
  try {
    const {
      name,
      price,
      type,
      category,
      description,
      compatiblePlans,
      bundles,
      status
    } = req.body;

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'محصول یافت نشد' });
    }

    // Update fields
    if (name) product.name = name;
    if (price) product.price = Number(price);
    if (type) product.type = type;
    if (category) product.category = category;
    if (description) product.description = description;
    if (status) product.status = status;

    // Parse and update arrays
    if (compatiblePlans) {
      product.compatiblePlans = typeof compatiblePlans === 'string' 
        ? JSON.parse(compatiblePlans) 
        : compatiblePlans;
    }

    if (bundles) {
      product.bundles = typeof bundles === 'string' 
        ? JSON.parse(bundles) 
        : bundles;
    }

    // Handle image upload
    if (req.file) {
      const baseUrl = `${req.protocol}://${req.get('host')}`;
      product.image = `${baseUrl}/uploads/products/${req.file.filename}`;
    }

    await product.save();

    res.json({ 
      success: true, 
      message: 'محصول با موفقیت به‌روزرسانی شد',
      product 
    });
  } catch (error) {
    console.error('Error in updateProduct:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ success: false, message: error.message });
    }
    res.status(500).json({ success: false, message: 'خطا در به‌روزرسانی محصول' });
  }
};

// @desc    Delete product
// @route   DELETE /api/admin/products/:id
// @access  Admin
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'محصول یافت نشد' });
    }

    // Delete image file (optional - you can implement fs.unlink if needed)
    // const fs = require('fs');
    // if (product.image && fs.existsSync(`.${product.image}`)) {
    //   fs.unlinkSync(`.${product.image}`);
    // }

    await Product.findByIdAndDelete(req.params.id);

    res.json({ 
      success: true, 
      message: 'محصول با موفقیت حذف شد' 
    });
  } catch (error) {
    console.error('Error in deleteProduct:', error);
    res.status(500).json({ success: false, message: 'خطا در حذف محصول' });
  }
};

// @desc    Toggle product status
// @route   PATCH /api/admin/products/:id/status
// @access  Admin
exports.toggleStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'محصول یافت نشد' });
    }

    product.status = status;
    await product.save();

    res.json({ 
      success: true, 
      message: 'وضعیت محصول با موفقیت تغییر کرد',
      product 
    });
  } catch (error) {
    console.error('Error in toggleStatus:', error);
    res.status(500).json({ success: false, message: 'خطا در تغییر وضعیت' });
  }
};