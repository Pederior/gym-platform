const express = require('express')
const { protect } = require('../middleware/auth.middleware')
const { 
  getMessages,        // برای چت بین دو کاربر
  sendMessage,
  getChatUsers,       // لیست کاربران
  getChatCoaches      // لیست مربیان
} = require('../controllers/chat.controller')

const router = express.Router()

// ✅ routeهای لیست (بدون پارامتر)
router.get('/coaches', protect, getChatCoaches) // GET /api/chat/coaches
router.get('/users', protect, getChatUsers)     // GET /api/chat/users

// ✅ route چت (با پارامتر)
router.get('/:receiverId', protect, getMessages) // GET /api/chat/آیدی_کاربر
router.post('/send', protect, sendMessage)

module.exports = router