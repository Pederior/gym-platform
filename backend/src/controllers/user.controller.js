const User = require('../models/User')
const WorkoutPlan = require('../models/WorkoutPlan')
const Class = require('../models/Class')
const UserProgress = require('../models/UserProgress')
const UserWorkout = require('../models/UserWorkout')
const Subscription = require('../models/Subscription')
const Payment = require('../models/Payment')

// --- Profile ---
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password')
    res.status(200).json({ success: true, user })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

const updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, email },
      { new: true, runValidators: true }
    ).select('-password')
    res.status(200).json({ success: true, user })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

// --- Admin: Manage Users ---
const getAllUsers = async (req, res) => {
  try {
    const query = req.query.role ? { role: req.query.role } : {}
    const users = await User.find(query).select('-password')
    res.status(200).json({ success: true, users })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

const createUser = async (req, res) => {
  try {
    const { name, email, password, role = 'user' } = req.body
    const userExists = await User.findOne({ email })
    if (userExists) {
      return res.status(400).json({ success: false, message: 'کاربری با این ایمیل وجود دارد' })
    }
    const user = await User.create({ name, email, password, role })
    res.status(201).json({ success: true, user })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

const updateUser = async (req, res) => {
  try {
    const { name, email, role } = req.body
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { name, email, role },
      { new: true, runValidators: true }
    ).select('-password')
    if (!user) {
      return res.status(404).json({ success: false, message: 'کاربر یافت نشد' })
    }
    res.status(200).json({ success: true, user })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id)
    if (!user) {
      return res.status(404).json({ success: false, message: 'کاربر یافت نشد' })
    }
    res.status(200).json({ success: true, message: 'کاربر با موفقیت حذف شد' })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

// --- User Dashboard: Classes ---
const getUserClasses = async (req, res) => {
  try {
    // ✅ کوئری صحیح برای ساختار reservedBy
    const classes = await Class.find({ 
      'reservedBy.user': req.user._id 
    }).populate('coach', 'name')
    
    res.status(200).json({ success: true, classes })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

// --- User Dashboard: Progress ---
const getUserProgress = async (req, res) => {
  try {
    const progressRecords = await UserProgress.find({ 
      user: req.user._id 
    })
      .populate('workout', 'title')
      .sort({ lastActivity: -1 })

    const progress = progressRecords.map(record => ({
      _id: record._id.toString(),
      workout: record.workout?.title || 'برنامه نامشخص',
      completedDays: record.completedDays,
      totalDays: record.totalDays,
      lastActivity: record.lastActivity,
      status: record.status
    }))

    res.status(200).json({ success: true, progress })
  } catch (err) {
    console.error('Error in getUserProgress:', err)
    res.status(500).json({ success: false, message: err.message })
  }
}

// --- User Dashboard: Subscription ---
const getSubscription = async (req, res) => {
  try {
    const subscription = await Subscription.findOne({ 
      user: req.user._id,
      status: 'active',
      expiresAt: { $gt: new Date() }
    });
    
    res.status(200).json({ success: true, subscription });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// --- User Dashboard: Payments ---
const getUserPayments = async (req, res) => {
  try {
    const payments = await Payment.find({ 
      user: req.user._id 
    }).sort({ createdAt: -1 })
    res.status(200).json({ success: true, payments })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}
const getUserWorkouts = async (req, res) => {
  try {
    // پیدا کردن رکوردهای اختصاص داده‌شده به این کاربر
    const userWorkouts = await UserWorkout.find({ 
      user: req.user._id,
      status: 'active'
    }).populate('workout', 'title description duration')

    const workouts = userWorkouts.map(uw => ({
      _id: uw.workout._id,
      title: uw.workout.title,
      description: uw.workout.description,
      duration: uw.workout.duration,
      assignedAt: uw.assignedAt
    }))

    res.status(200).json({ success: true, workouts })
  } catch (err) {
    console.error('Error in getUserWorkouts:', err)
    res.status(500).json({ success: false, message: 'خطا در بارگذاری برنامه‌ها' })
  }
}

const submitWorkoutProgress = async (req, res) => {
  try {
    const { workoutId, completedDays = 1 } = req.body
    const userId = req.user._id

    // پیدا کردن یا ایجاد رکورد پیشرفت
    let progress = await UserProgress.findOne({ user: userId, workout: workoutId })
    
    if (progress) {
      // به‌روزرسانی
      progress.completedDays += completedDays
      progress.lastActivity = new Date()
      if (progress.completedDays >= progress.totalDays) {
        progress.status = 'completed'
      }
    } else {
      // ایجاد جدید
      const workout = await WorkoutPlan.findById(workoutId)
      if (!workout) {
        return res.status(404).json({ success: false, message: 'برنامه یافت نشد' })
      }
      
      progress = await UserProgress.create({
        user: userId,
        workout: workoutId,
        totalDays: workout.duration,
        completedDays: completedDays
      })
    }

    await progress.save()
    res.status(200).json({ success: true, progress })
  } catch (err) {
    console.error('Submit progress error:', err)
    res.status(500).json({ success: false, message: err.message })
  }
}

const getWorkoutDetail = async (req, res) => {
  try {
    const { workoutId } = req.params
    
    // بررسی اینکه کاربر واقعاً این برنامه رو داره
    const userWorkout = await UserWorkout.findOne({ 
      user: req.user._id,
      workout: workoutId,
      status: 'active'
    })
    
    if (!userWorkout) {
      return res.status(403).json({ success: false, message: 'دسترسی غیرمجاز' })
    }
    
    const workout = await WorkoutPlan.findById(workoutId)
    if (!workout) {
      return res.status(404).json({ success: false, message: 'برنامه یافت نشد' })
    }
    
    res.status(200).json({ success: true, workout })
  } catch (err) {
    console.error('Get workout detail error:', err)
    res.status(500).json({ success: false, message: err.message })
  }
}

const createSubscription = async (req, res) => {
  try {
    const { planId, duration } = req.body;

    // Validate input
    if (!planId || !duration) {
      return res.status(400).json({ 
        success: false, 
        message: 'لطفاً پلن و مدت زمان را انتخاب کنید' 
      });
    }

    // Define plan prices
    const plans = {
      bronze: { monthly: 199000, quarterly: 549000, yearly: 1999000 },
      silver: { monthly: 399000, quarterly: 1099000, yearly: 3999000 },
      gold: { monthly: 699000, quarterly: 1999000, yearly: 6999000 }
    };

    // Validate plan
    if (!plans[planId]) {
      return res.status(400).json({ 
        success: false, 
        message: 'پلن انتخاب شده معتبر نیست' 
      });
    }

    // Validate duration
    if (!plans[planId][duration]) {
      return res.status(400).json({ 
        success: false, 
        message: 'مدت زمان انتخاب شده معتبر نیست' 
      });
    }

    // Calculate amount
    const amount = plans[planId][duration];

    // Calculate expiration date
    let expiresAt = new Date();
    if (duration === 'monthly') {
      expiresAt.setMonth(expiresAt.getMonth() + 1);
    } else if (duration === 'quarterly') {
      expiresAt.setMonth(expiresAt.getMonth() + 3);
    } else if (duration === 'yearly') {
      expiresAt.setFullYear(expiresAt.getFullYear() + 1);
    }

    // Check if user has an active subscription
    const existingSubscription = await Subscription.findOne({
      user: req.user._id,
      status: 'active',
      expiresAt: { $gt: new Date() }
    });

    if (existingSubscription) {
      // Update existing subscription
      existingSubscription.plan = planId;
      existingSubscription.duration = duration;
      existingSubscription.amount = amount;
      existingSubscription.startDate = new Date();
      existingSubscription.expiresAt = expiresAt;
      existingSubscription.status = 'active';
      
      await existingSubscription.save();
      
      // Update user's currentSubscription reference
      await User.findByIdAndUpdate(req.user._id, {
        currentSubscription: existingSubscription._id
      });

      // Create payment record
      await Payment.create({
        user: req.user._id,
        amount,
        type: 'subscription',
        subscriptionId: existingSubscription._id,
        method: 'online',
        status: 'completed',
        description: `تمدید اشتراک ${planId} - ${duration}`,
        transactionId: `SUB_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      });

      return res.status(200).json({
        success: true,
        message: 'اشتراک شما با موفقیت تمدید شد',
        subscription: existingSubscription
      });
    } else {
      // Create new subscription
      const subscription = await Subscription.create({
        user: req.user._id,
        plan: planId,
        duration,
        amount,
        startDate: new Date(),
        expiresAt,
        status: 'active'
      });

      // Update user's currentSubscription reference
      await User.findByIdAndUpdate(req.user._id, {
        currentSubscription: subscription._id
      });

      // Create payment record
      await Payment.create({
        user: req.user._id,
        amount,
        type: 'subscription',
        subscriptionId: subscription._id,
        method: 'online',
        status: 'completed',
        description: `خرید اشتراک ${planId} - ${duration}`,
        transactionId: `SUB_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      });

      res.status(201).json({
        success: true,
        message: 'اشتراک شما با موفقیت فعال شد',
        subscription
      });
    }
  } catch (error) {
    console.error('Error in createSubscription:', error);
    res.status(500).json({ 
      success: false, 
      message: 'خطا در فعال‌سازی اشتراک' 
    });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  getUserWorkouts,
  getUserClasses,
  getUserProgress,
  getSubscription,
  getUserPayments,
  submitWorkoutProgress,
  getWorkoutDetail,
  createSubscription 
}