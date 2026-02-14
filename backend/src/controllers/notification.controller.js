const Notification = require('../models/Notification')

const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ 
      userId: req.user._id,
      read: false
    }).sort({ createdAt: -1 })
    
    res.status(200).json({ success: true, notifications })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

const deleteNotification = async (req, res) => {
  try {
    await Notification.findByIdAndDelete(req.params.id)
    res.status(200).json({ success: true, message: 'اعلان حذف شد' })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

const markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { userId: req.user._id },
      { read: true }
    )
    res.status(200).json({ success: true, message: 'همه اعلان‌ها خوانده شدند' })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

module.exports = {
  getNotifications,
  deleteNotification,
  markAllAsRead
}