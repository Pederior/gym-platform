const express = require('express')
const { protect } = require('../middleware/auth.middleware')
const { 
  getNotifications, 
  deleteNotification, 
  markAllAsRead 
} = require('../controllers/notification.controller')

const router = express.Router()

router.use(protect)

router.get('/', getNotifications)
router.delete('/:id', deleteNotification)
router.post('/mark-all-read', markAllAsRead)

module.exports = router