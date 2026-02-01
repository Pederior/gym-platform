const UserWorkout = require('../models/UserWorkout')

const createUserWorkout = async (req, res) => {
  try {
    const { userId, workoutId } = req.body

    // ❌ حذف این بررسی (چون middleware انجامش داده)
    // if (req.user.role !== 'coach') { ... }

    const existing = await UserWorkout.findOne({ user: userId, workout: workoutId })
    if (existing) {
      return res.status(400).json({ success: false, message: 'این برنامه قبلاً به کاربر اختصاص داده شده' })
    }

    const userWorkout = await UserWorkout.create({
      user: userId,
      workout: workoutId,
      assignedBy: req.user._id
    })

    res.status(201).json({ success: true, userWorkout })
  } catch (err) {
    console.error('Create user workout error:', err)
    res.status(500).json({ success: false, message: err.message })
  }
}

module.exports = { createUserWorkout }