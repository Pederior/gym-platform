const DietPlan = require('../models/DietPlan');
const UserDietPlan = require('../models/UserDietPlan');
const User = require('../models/User');

// --- GET all diet plans for coach
const getDietPlans = async (req, res) => {
  try {
    const dietPlans = await DietPlan.find({ createdBy: req.user._id });
    res.status(200).json({ success: true, data: dietPlans });
  } catch (err) {
    console.error('Error in getDietPlans:', err);
    res.status(500).json({ success: false, message: 'خطا در بارگذاری برنامه‌های غذایی' });
  }
};

// --- POST create new diet plan
const createDietPlan = async (req, res) => {
  try {
    const { title, description, duration, diets } = req.body;

    if (!title || !duration || !diets || !Array.isArray(diets) || diets.length === 0) {
      return res.status(400).json({ success: false, message: 'اطلاعات ناقص است' });
    }

    const dietPlan = await DietPlan.create({
      title,
      description,
      duration,
      diets,
      createdBy: req.user._id
    });

    res.status(201).json({ success: true, dietPlan });
  } catch (err) {
    console.error('Error in createDietPlan:', err);
    res.status(500).json({ success: false, message: 'خطا در ایجاد برنامه غذایی' });
  }
};

// --- GET diet plan by ID
const getDietPlanById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const dietPlan = await DietPlan.findOne({
      _id: id,
      createdBy: req.user._id
    });
    
    if (!dietPlan) {
      return res.status(404).json({ success: false, message: 'برنامه غذایی یافت نشد' });
    }
    
    res.status(200).json({ success: true, data: dietPlan });
  } catch (err) {
    console.error('Error in getDietPlanById:', err);
    res.status(500).json({ success: false, message: 'خطا در بارگذاری برنامه غذایی' });
  }
};

// --- PUT update diet plan
const updateDietPlan = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, duration, diets } = req.body;

    if (!title || !duration || !diets || !Array.isArray(diets) || diets.length === 0) {
      return res.status(400).json({ success: false, message: 'اطلاعات ناقص است' });
    }

    const dietPlan = await DietPlan.findOneAndUpdate(
      { _id: id, createdBy: req.user._id },
      { title, description, duration, diets },
      { new: true }
    );

    if (!dietPlan) {
      return res.status(404).json({ success: false, message: 'برنامه غذایی یافت نشد' });
    }

    res.status(200).json({ success: true, dietPlan });
  } catch (err) {
    console.error('Error in updateDietPlan:', err);
    res.status(500).json({ success: false, message: 'خطا در به‌روزرسانی برنامه غذایی' });
  }
};

// --- DELETE diet plan
const deleteDietPlan = async (req, res) => {
  try {
    const { id } = req.params;

    const activeAssignments = await UserDietPlan.countDocuments({
      dietPlan: id,
      status: 'active'
    });

    if (activeAssignments > 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'این برنامه به کاربران اختصاص داده شده و قابل حذف نیست' 
      });
    }

    const dietPlan = await DietPlan.findOneAndDelete({
      _id: id,
      createdBy: req.user._id
    });

    if (!dietPlan) {
      return res.status(404).json({ success: false, message: 'برنامه غذایی یافت نشد' });
    }

    res.status(200).json({ success: true, message: 'برنامه غذایی با موفقیت حذف شد' });
  } catch (err) {
    console.error('Error in deleteDietPlan:', err);
    res.status(500).json({ success: false, message: 'خطا در حذف برنامه غذایی' });
  }
};

// --- POST assign diet plan to user
const assignDietPlan = async (req, res) => {
  try {
    const { userId, dietPlanId } = req.body;

    const user = await User.findById(userId);
    if (!user || user.role !== 'user') {
      return res.status(404).json({ success: false, message: 'کاربر یافت نشد' });
    }

    const dietPlan = await DietPlan.findOne({
      _id: dietPlanId,
      createdBy: req.user._id
    });

    if (!dietPlan) {
      return res.status(404).json({ success: false, message: 'برنامه غذایی یافت نشد' });
    }

    const existingAssignment = await UserDietPlan.findOne({
      user: userId,
      dietPlan: dietPlanId,
      status: 'active'
    });

    if (existingAssignment) {
      return res.status(400).json({ success: false, message: 'این برنامه قبلاً به کاربر اختصاص داده شده' });
    }

    const userDietPlan = await UserDietPlan.create({
      user: userId,
      dietPlan: dietPlanId,
      assignedBy: req.user._id,
      progress: {
        totalDays: dietPlan.duration,
        completedDays: 0
      }
    });

    res.status(201).json({ success: true, message: 'برنامه غذایی با موفقیت به کاربر اختصاص داده شد' });
  } catch (err) {
    console.error('Error in assignDietPlan:', err);
    res.status(500).json({ success: false, message: 'خطا در اختصاص برنامه غذایی' });
  }
};

// --- GET assigned users for a diet plan
const getAssignedUsers = async (req, res) => {
  try {
    const { dietPlanId } = req.params;

    const dietPlan = await DietPlan.findOne({
      _id: dietPlanId,
      createdBy: req.user._id
    });

    if (!dietPlan) {
      return res.status(404).json({ success: false, message: 'برنامه غذایی یافت نشد' });
    }

    const assignments = await UserDietPlan.find({
      dietPlan: dietPlanId
    })
    .populate('user', 'name email')
    .sort({ createdAt: -1 });

    const assignedUsers = assignments.map(assignment => ({
      _id: assignment._id.toString(),
      user: {
        _id: assignment.user._id.toString(),
        name: assignment.user.name,
        email: assignment.user.email
      },
      status: assignment.status,
      completedDays: assignment.progress.completedDays,
      totalDays: assignment.progress.totalDays,
      assignedAt: assignment.createdAt
    }));

    res.status(200).json({ success: true,  data: assignedUsers });
  } catch (err) {
    console.error('Error in getAssignedUsers:', err);
    res.status(500).json({ success: false, message: 'خطا در بارگذاری لیست کاربران' });
  }
};

module.exports = {
  getDietPlans,
  createDietPlan,
  getDietPlanById,
  updateDietPlan,
  deleteDietPlan,
  assignDietPlan,
  getAssignedUsers
};