const express = require('express')
const { protect } = require('../middleware/auth.middleware')
const { authorize } = require('../middleware/role.middleware')
const {
  getClasses,
  getEquipment,
  getSettings,
  updateSettings,
  getPricing,
  updatePricing,
  createEquipment,
  getRooms,
  createRoom
} = require('../controllers/admin.controller')

const router = express.Router()

// فقط مدیر دسترسی داره
router.use(protect, authorize('admin'))

// Classes
router.get('/classes', getClasses)

// Equipment
router.get('/equipment', getEquipment)
router.post('/equipment', createEquipment)

// Rooms
router.get('/rooms', getRooms)
router.post('/rooms', createRoom)

// Settings
router.get('/settings', getSettings)
router.put('/settings', updateSettings)

// Pricing
router.get('/settings/pricing', getPricing)
router.put('/settings/pricing', updatePricing)

module.exports = router