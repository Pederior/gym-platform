const express = require('express')
const { protect } = require('../middleware/auth.middleware')
const { 
  getProfile,
  updateProfile,
  getAllUsers,
  createUser,
  updateUser,
  updateUserPassword,
  deleteUser,
  getUserWorkouts,
  getUserClasses,
  getUserProgress,
  getSubscription,
  getUserPayments,
  submitWorkoutProgress,
  getWorkoutDetail,
  createSubscription,
  getDietPlans
} = require('../controllers/user.controller')

const { authorize } = require('../middleware/role.middleware');
const Class = require('../models/Class');
const UserProgress = require('../models/UserProgress');
const UserWorkout = require('../models/UserWorkout');
const UserDietPlan = require('../models/UserDietPlan');
const DietPlan = require('../models/DietPlan');

const router = express.Router()

// Profile routes (for all users)
router.get('/profile', protect, getProfile)
router.put('/profile', protect, updateProfile)

// Admin routes
router.get('/', protect, authorize('admin'), getAllUsers)
router.post('/', protect, authorize('admin'), createUser)
router.put('/:id', protect, authorize('admin'), updateUser)
router.put('/:id/password', protect, authorize('admin'), updateUserPassword)
router.delete('/:id', protect, authorize('admin'), deleteUser)

// User dashboard routes
router.get('/workouts', protect, getUserWorkouts)
router.get('/classes', protect, getUserClasses)
router.get('/progress', protect, getUserProgress)
router.get('/subscription', protect, getSubscription);
router.get('/payments', protect, getUserPayments)
router.post('/progress', protect, submitWorkoutProgress)

// Subscription routes
router.post('/subscription', protect, createSubscription);

// GET /api/user/dashboard/stats
router.get('/dashboard/stats', protect, async (req, res) => {
  try {
    const reservedClasses = await Class.countDocuments({ "reservedBy.user": req.user._id });
    const completedWorkouts = await UserProgress.countDocuments({ 
      user: req.user._id,
      lastActivity: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
    });
    const weeklyProgress = completedWorkouts > 0 ? Math.min(100, completedWorkouts * 20) : 0;

    res.json({
      success: true,
       data: {
        reservedClasses,
        completedWorkouts,
        weeklyProgress
      }
    })
  } catch (err) {
    console.error('Dashboard stats error:', err);
    res.status(500).json({ success: false, message: 'خطای سرور' });
  }
});

// GET /api/user/workouts/assigned
router.get('/workouts/assigned', protect, async (req, res) => {
  try {
    // console.log('🔍 Debug: User ID:', req.user._id);
    
    const userWorkouts = await UserWorkout.find({
      user: req.user._id,
      status: 'active'
    })
    .populate('workout', 'title description duration isActive')
    .sort({ createdAt: -1 });

    // console.log('🔍 Debug: Found UserWorkouts:', userWorkouts.length);
    // console.log('🔍 Debug: UserWorkouts data:', JSON.stringify(userWorkouts, null, 2));

    const assignedWorkouts = userWorkouts.map(uw => {
      // console.log('🔍 Debug: Processing workout:', uw.workout);
      return {
        _id: uw.workout?._id?.toString() || null,
        title: uw.workout?.title || 'برنامه نامشخص',
        description: uw.workout?.description || '',
        duration: uw.workout?.duration || 0,
        isActive: uw.workout?.isActive || false,
        assignedAt: uw.createdAt,
        completedDays: uw.progress?.completedDays || 0,
        totalDays: uw.progress?.totalDays || null
      };
    }).filter(item => item._id !== null); // فیلتر آیتم‌های نامعتبر

    // console.log('🔍 Debug: Final response:', assignedWorkouts);

    res.json({
      success: true,
      data: assignedWorkouts
    });
  } catch (err) {
    console.error('Assigned workouts error:', err);
    res.status(500).json({ success: false, message: 'خطای سرور' });
  }
});

router.get('/workouts/:workoutId', protect, getWorkoutDetail)

// GET /api/user/diet-plans/current
router.get('/diet-plans/current', protect, getDietPlans);

module.exports = router