const express = require('express')
const { protect } = require('../middleware/auth.middleware')
const { authorize } = require('../middleware/role.middleware')
const { getLogs } = require('../controllers/log.controller')

const router = express.Router()

// فقط مدیر دسترسی داره
router.use(protect, authorize('admin'))

router.get('/logs', getLogs)

module.exports = router