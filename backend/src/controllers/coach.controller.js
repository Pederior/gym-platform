const UserProgress = require('../models/UserProgress')
const WorkoutPlan = require('../models/WorkoutPlan')

// --- GET progress for coach
const getProgress = async (req, res) => {
  try {
    const coachWorkouts = await WorkoutPlan.find({ createdBy: req.user._id }).select('_id title')
    if (!coachWorkouts.length) {
      return res.status(200).json({ success: true, progress: [] })
    }

    const workoutIds = coachWorkouts.map(w => w._id)
    const progressRecords = await UserProgress.find({ 
      workout: { $in: workoutIds } 
    })
      .populate('user', 'name')
      .populate('workout', 'title')
      .sort({ lastActivity: -1 })

    const progress = progressRecords.map(record => ({
      _id: record._id.toString(),
      user: {
        _id: record.user._id.toString(),
        name: record.user.name
      },
      workout: record.workout.title,
      completedDays: record.completedDays,
      totalDays: record.totalDays,
      lastActivity: record.lastActivity,
      status: record.status
    }))

    res.status(200).json({ success: true, progress })
  } catch (err) {
    console.error('Error in getProgress:', err)
    res.status(500).json({ success: false, message: 'خطا در بارگذاری پیشرفت' })
  }
}

// --- POST create progress record
const createProgress = async (req, res) => {
  try {
    const { userId, workoutId } = req.body

    // بررسی اینکه آیا این برنامه متعلق به این مربی هست
    const workout = await WorkoutPlan.findOne({ 
      _id: workoutId, 
      createdBy: req.user._id 
    })
    if (!workout) {
      return res.status(403).json({ success: false, message: 'شما دسترسی به این برنامه ندارید' })
    }

    // ایجاد رکورد پیشرفت
    const progress = await UserProgress.create({
      user: userId,
      workout: workoutId,
      totalDays: workout.duration,
      completedDays: 0,
      status: 'active'
    })

    res.status(201).json({ success: true, progress })
  } catch (err) {
    console.error('Error in createProgress:', err)
    res.status(500).json({ success: false, message: 'خطا در ایجاد پیشرفت' })
  }
}

// --- PUT update progress (when user completes a day)
const updateProgress = async (req, res) => {
  try {
    const { id } = req.params
    const { completedDays } = req.body

    // پیدا کردن رکورد و بررسی مالکیت
    const progress = await UserProgress.findById(id)
    if (!progress) {
      return res.status(404).json({ success: false, message: 'رکورد پیشرفت یافت نشد' })
    }

    // بررسی اینکه آیا این برنامه متعلق به این مربی هست
    const workout = await WorkoutPlan.findOne({ 
      _id: progress.workout, 
      createdBy: req.user._id 
    })
    if (!workout) {
      return res.status(403).json({ success: false, message: 'شما دسترسی به این رکورد ندارید' })
    }

    // به‌روزرسانی
    progress.completedDays = completedDays
    progress.lastActivity = new Date()
    
    // بررسی تکمیل شدن
    if (completedDays >= progress.totalDays) {
      progress.status = 'completed'
    }

    await progress.save()

    res.status(200).json({ success: true, progress })
  } catch (err) {
    console.error('Error in updateProgress:', err)
    res.status(500).json({ success: false, message: 'خطا در به‌روزرسانی پیشرفت' })
  }
}

module.exports = {
  getProgress,
  createProgress,
  updateProgress
}