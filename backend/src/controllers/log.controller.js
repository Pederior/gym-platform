const Log = require('../models/Log')

const getLogs = async (req, res) => {
  try {
    const logs = await Log.find()
      .populate('user', 'name email')
      .sort({ timestamp: -1 })
      .limit(100) // آخرین 100 لاگ
    
    res.status(200).json({ success: true, logs })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

module.exports = { getLogs }