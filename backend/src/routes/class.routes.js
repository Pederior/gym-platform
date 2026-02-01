const express = require('express')
const { protect } = require('../middleware/auth.middleware')
const { authorize } = require('../middleware/role.middleware')
const {
  createClass,
  getClasses,
  getClassById,
  reserveClass,
  getReservedClasses
} = require('../controllers/class.controller')

const router = express.Router()

// فقط مدیر یا مربی می‌تونه کلاس ایجاد کنه
router.route('/')
  .post(protect, authorize('coach', 'admin'), createClass)
  .get(protect, getClasses)

router.route('/:id')
  .get(protect, getClassById)

// رزرو کلاس (فقط کاربران معمولی)
router.route('/:id/reserve')
  .post(protect, authorize('user'), reserveClass)

// کلاس‌های رزرو شده توسط کاربر
router.route('/my-reservations')
  .get(protect, getReservedClasses)

module.exports = router