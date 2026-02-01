const express = require('express')
const { protect } = require('../middleware/auth.middleware')
const { authorize } = require('../middleware/role.middleware')
const { getProgress, createProgress, updateProgress } = require('../controllers/coach.controller')

const router = express.Router()

// فقط مربی‌ها
router.use(protect, authorize('coach'))

// GET /api/coach/progress → لیست پیشرفت
router.get('/progress', getProgress)

// POST /api/coach/progress → ایجاد رکورد پیشرفت
router.post('/progress', createProgress)

// PUT /api/coach/progress/:id → به‌روزرسانی پیشرفت
router.put('/progress/:id', updateProgress)

module.exports = router