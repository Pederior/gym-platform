const Payment = require('../models/Payment');
const Order = require('../models/Order');

// @desc    Get user payments (including orders)
// @route   GET /api/payments
// @access  Private
exports.getUserPayments = async (req, res) => {
  try {
    const payments = await Payment.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .populate('orderId', 'products totalAmount status')
      .populate('subscriptionId', 'plan amount status');

    // Format payments for frontend
    const formattedPayments = payments.map(payment => {
      let description = payment.description || '';
      let details = {};

      if (payment.type === 'order' && payment.orderId) {
        description = `خرید ${payment.orderId.products.length} محصول از فروشگاه`;
        details = {
          orderId: payment.orderId._id,
          productCount: payment.orderId.products.length,
          totalAmount: payment.orderId.totalAmount,
          orderStatus: payment.orderId.status
        };
      } else if (payment.type === 'subscription' && payment.subscriptionId) {
        description = `اشتراک ${payment.subscriptionId.plan}`;
        details = {
          subscriptionId: payment.subscriptionId._id,
          plan: payment.subscriptionId.plan,
          amount: payment.subscriptionId.amount,
          status: payment.subscriptionId.status
        };
      }

      return {
        _id: payment._id,
        amount: payment.amount,
        type: payment.type,
        method: payment.method,
        status: payment.status,
        description,
        details,
        transactionId: payment.transactionId,
        createdAt: payment.createdAt
      };
    });

    res.json({
      success: true,
      payments: formattedPayments
    });
  } catch (error) {
    console.error('Error in getUserPayments:', error);
    res.status(500).json({ 
      success: false, 
      message: 'خطا در دریافت تاریخچه پرداخت‌ها' 
    });
  }
};

// @desc    Get single payment
// @route   GET /api/payments/:id
// @access  Private
exports.getPaymentById = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate('orderId')
      .populate('subscriptionId');

    if (!payment) {
      return res.status(404).json({ 
        success: false, 
        message: 'پرداخت یافت نشد' 
      });
    }

    // Check if user owns this payment
    if (payment.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ 
        success: false, 
        message: 'دسترسی غیرمجاز' 
      });
    }

    res.json({
      success: true,
      payment
    });
  } catch (error) {
    console.error('Error in getPaymentById:', error);
    res.status(500).json({ 
      success: false, 
      message: 'خطا در دریافت جزئیات پرداخت' 
    });
  }
};