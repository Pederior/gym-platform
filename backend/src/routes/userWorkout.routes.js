const express = require('express')
const { protect } = require('../middleware/auth.middleware')
const { authorize } = require('../middleware/role.middleware')
const { createUserWorkout } = require('../controllers/userWorkout.controller')

const router = express.Router()

// ✅ فقط مربی‌ها
router.use(protect, authorize('coach')) // ← حتماً 'coach' باشه

router.post('/', createUserWorkout)

module.exports = router