const express = require('express')
const { protect } = require('../middleware/auth.middleware')
const { 
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
} = require('../controllers/user.controller')

const router = express.Router()

// Profile routes (for all users)
router.get('/profile', protect, getProfile)
router.put('/profile', protect, updateProfile)

// Admin routes
router.get('/', protect, getAllUsers)
router.post('/', protect, createUser)
router.put('/:id', protect, updateUser)
router.delete('/:id', protect, deleteUser)

// User dashboard routes
router.get('/workouts', protect, getUserWorkouts)
router.get('/classes', protect, getUserClasses)
router.get('/progress', protect, getUserProgress)
router.get('/subscription', protect, getSubscription);
router.get('/payments', protect, getUserPayments)
router.post('/progress', protect, submitWorkoutProgress)
router.get('/workouts/:workoutId', protect, getWorkoutDetail)

// Subscription routes
router.post('/subscription', protect, createSubscription);

module.exports = router