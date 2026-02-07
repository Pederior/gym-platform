const SubscriptionPlan = require('../models/SubscriptionPlan');

// --- GET all plans (for admin)
const getAdminPlans = async (req, res) => {
  try {
    const plans = await SubscriptionPlan.find().sort({ order: 1 });
    res.json({ success: true,  plans });
  } catch (err) {
    console.error('Get admin plans error:', err);
    res.status(500).json({ success: false, message: 'خطا در بارگذاری پلن‌ها' });
  }
};

// --- POST create/update plan (for admin)
const upsertPlan = async (req, res) => {
  try {
    const { id, name, description, isPopular, isActive, features, price, order } = req.body;
    
    if (!id || !['bronze', 'silver', 'gold'].includes(id)) {
      return res.status(400).json({ success: false, message: 'شناسه پلن نامعتبر است' });
    }
    
    if (!name || !description || !price) {
      return res.status(400).json({ success: false, message: 'اطلاعات ناقص است' });
    }
    
    const plan = await SubscriptionPlan.findOneAndUpdate(
      { id },
      { name, description, isPopular, isActive, features, price, order },
      { upsert: true, new: true, runValidators: true }
    );
    
    res.status(200).json({ success: true, plan });
  } catch (err) {
    console.error('Upsert plan error:', err);
    res.status(500).json({ success: false, message: 'خطا در ذخیره پلن' });
  }
};

// --- DELETE plan (for admin)
const deletePlan = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!['bronze', 'silver', 'gold'].includes(id)) {
      return res.status(400).json({ success: false, message: 'حذف این پلن مجاز نیست' });
    }
    
    const plan = await SubscriptionPlan.findOneAndDelete({ id });
    if (!plan) {
      return res.status(404).json({ success: false, message: 'پلن یافت نشد' });
    }
    
    res.json({ success: true, message: 'پلن با موفقیت حذف شد' });
  } catch (err) {
    console.error('Delete plan error:', err);
    res.status(500).json({ success: false, message: 'خطا در حذف پلن' });
  }
};

module.exports = {
  getAdminPlans,
  upsertPlan,
  deletePlan
};