const Order = require('../models/Order');
const Product = require('../models/Product');
const Payment = require('../models/Payment'); 

// @desc    Create new order
// @route   POST /api/orders
// @access  Private (Authenticated users)
exports.createOrder = async (req, res) => {
  try {
    const {
      products,
      customer,
      totalAmount
    } = req.body;

    if (!products || products.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'لطفاً حداقل یک محصول انتخاب کنید' 
      });
    }

    if (!customer?.fullName || !customer?.phone || !customer?.address || !customer?.postalCode || !customer?.city) {
      return res.status(400).json({ 
        success: false, 
        message: 'لطفاً تمام فیلدهای اجباری را پر کنید' 
      });
    }

    const verifiedProducts = [];
    for (const item of products) {
      const product = await Product.findById(item.productId);
      
      if (!product) {
        return res.status(404).json({ 
          success: false, 
          message: `محصول با شناسه ${item.productId} یافت نشد` 
        });
      }

      if (product.status !== 'active') {
        return res.status(400).json({ 
          success: false, 
          message: `محصول "${product.name}" در دسترس نیست` 
        });
      }

      verifiedProducts.push({
        productId: item.productId,
        name: item.name || product.name,
        price: item.price || product.price,
        quantity: item.quantity || 1
      });
    }

    const order = await Order.create({
      user: req.user._id, 
      products: verifiedProducts,
      customer,
      totalAmount,
      status: 'pending',
      paymentStatus: 'pending'
    });

    await Payment.create({
      user: req.user._id,
      amount: totalAmount,
      type: 'order',
      orderId: order._id,
      method: 'online',
      status: 'completed', 
      description: `خرید ${verifiedProducts.length} محصول از فروشگاه`,
      transactionId: `ORDER_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    });
    
    res.status(201).json({
      success: true,
      message: 'سفارش با موفقیت ثبت شد',
      order
    });
  } catch (error) {
    console.error('Error in createOrder:', error);
    res.status(500).json({ 
      success: false, 
      message: 'خطا در ثبت سفارش' 
    });
  }
};

// @desc    Get user orders
// @route   GET /api/orders
// @access  Private
exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .populate('products.productId', 'name price image');

    res.json({
      success: true,
      orders
    });
  } catch (error) {
    console.error('Error in getUserOrders:', error);
    res.status(500).json({ 
      success: false, 
      message: 'خطا در دریافت سفارشات' 
    });
  }
};

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('products.productId', 'name price image');

    if (!order) {
      return res.status(404).json({ 
        success: false, 
        message: 'سفارش یافت نشد' 
      });
    }

    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ 
        success: false, 
        message: 'دسترسی غیرمجاز' 
      });
    }

    res.json({
      success: true,
      order
    });
  } catch (error) {
    console.error('Error in getOrderById:', error);
    res.status(500).json({ 
      success: false, 
      message: 'خطا در دریافت سفارش' 
    });
  }
};

// @desc    Update order status (Admin)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status, trackingNumber } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ 
        success: false, 
        message: 'سفارش یافت نشد' 
      });
    }

    if (status) {
      order.status = status;
    }

    if (trackingNumber) {
      order.trackingNumber = trackingNumber;
    }

    await order.save();

    res.json({
      success: true,
      message: 'وضعیت سفارش به‌روزرسانی شد',
      order
    });
  } catch (error) {
    console.error('Error in updateOrderStatus:', error);
    res.status(500).json({ 
      success: false, 
      message: 'خطا در به‌روزرسانی وضعیت' 
    });
  }
};