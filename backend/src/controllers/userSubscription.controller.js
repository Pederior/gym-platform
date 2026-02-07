const SubscriptionPlan = require('../models/SubscriptionPlan');

// --- GET active plans (for users)
const getUserPlans = async (req, res) => {
  try {
    const plans = await SubscriptionPlan.find({ isActive: true })
      .sort({ order: 1 })
      .select('-__v -createdAt -updatedAt -isActive');
    
    res.json({ success: true,  plans });
  } catch (err) {
    console.error('Get user plans error:', err);
    res.status(500).json({ success: false, message: 'خطا در بارگذاری پلن‌ها' });
  }
};

module.exports = {
  getUserPlans
};