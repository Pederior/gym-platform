
const Product = require('../models/Product');

exports.getProducts = async (req, res) => {
  try {
    let sortOptions = {};
    const { sort, limit = 16, page = 1 } = req.query;
    const limitNum = parseInt(limit);
    const pageNum = parseInt(page);

    // Sorting logic
    switch (sort) {
      case "popularity":
        sortOptions = { soldCount: -1 };
        break;
      case "price":
        sortOptions = { price: 1 };
        break;
      case "price-desc":
        sortOptions = { price: -1 };
        break;
      case "date":
        sortOptions = { createdAt: -1 };
        break;
      case "date-asc":
        sortOptions = { createdAt: 1 };
        break;
      case "rating":
        sortOptions = { averageRating: -1 };
        break;
      case "discount-desc":
        sortOptions = { discount: -1 };
        break;
      default:
        sortOptions = { menuOrder: 1 };
    }

    const skip = (pageNum - 1) * limitNum;

    const products = await Product.find({ status: "active" })
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum)
      .select('-__v'); 

    const total = await Product.countDocuments({ status: "active" });

    res.status(200).json({
      success: true,
      products,
      pagination: {
        current: pageNum,
        pages: Math.ceil(total / limitNum),
        total,
      },
    });
  } catch (err) {
    console.error('Error in getProducts:', err);
    res.status(500).json({ success: false, message: 'خطا در دریافت محصولات' });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'محصول یافت نشد' });
    }

    // Only show active products
    if (product.status !== 'active') {
      return res.status(404).json({ success: false, message: 'محصول یافت نشد' });
    }

    res.status(200).json({
      success: true,
      product,
    });
  } catch (err) {
    console.error('Error in getProductById:', err);
    res.status(500).json({ success: false, message: 'خطا در دریافت محصول' });
  }
};