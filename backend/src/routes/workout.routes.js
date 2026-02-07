const express = require('express')
const { protect } = require('../middleware/auth.middleware')
const { authorize } = require('../middleware/role.middleware')
const {
  getWorkouts,
  createWorkout,
  updateWorkout,
  deleteWorkout,
  getWorkoutUsers
} = require('../controllers/workout.controller')

// const { createActivityLogger } = require('../middleware/activityLogger');

const router = express.Router()

// فقط کاربران لاگین‌شده (مربی یا مدیر)
router.use(protect)

// GET /api/workouts → لیست برنامه‌ها
router.get('/', getWorkouts)

// POST /api/workouts → ایجاد برنامه جدید
router.post('/', createWorkout)

// PUT /api/workouts/:id → ویرایش برنامه
router.put('/:id', updateWorkout)

// DELETE /api/workouts/:id → حذف برنامه
router.delete('/:id', deleteWorkout)

router.get('/:id/users',authorize('coach'), getWorkoutUsers)


// For Logs
// router.post(
//   '/progress',
//   protect,
//   createActivityLogger(
//     'complete_workout',
//     (req) => `تکمیل روز ${req.body.completedDays} از برنامه`,
//     (req) => ({ workoutId: req.body.workoutId, completedDays: req.body.completedDays })
//   ),
//   submitWorkoutProgress
// );

module.exports = router