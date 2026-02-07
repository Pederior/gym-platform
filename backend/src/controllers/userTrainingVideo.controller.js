// controllers/userTrainingVideo.controller.js
const TrainingVideo = require('../models/TrainingVideo');

// --- GET videos available to user based on subscription
const getUserVideos = async (req, res) => {
  try {
    const userSubscription = req.user.currentSubscription?.plan || 'bronze';
    
    // تعیین سطح دسترسی بر اساس اشتراک
    let allowedLevels = [];
    if (userSubscription === 'gold') {
      allowedLevels = ['bronze', 'silver', 'gold'];
    } else if (userSubscription === 'silver') {
      allowedLevels = ['bronze', 'silver'];
    } else {
      allowedLevels = ['bronze'];
    }
    
    const videos = await TrainingVideo.find({
      accessLevel: { $in: allowedLevels },
      isActive: true
    })
    .select('title description thumbnail duration category accessLevel')
    .sort({ createdAt: -1 });
    
    res.json({ success: true, data: videos });
  } catch (err) {
    res.status(500).json({ success: false, message: 'خطا در بارگذاری ویدیوها' });
  }
};

// --- GET single video by ID
const getVideoById = async (req, res) => {
  try {
    const { id } = req.params;
    const userSubscription = req.user.currentSubscription?.plan || 'bronze';
    
    const video = await TrainingVideo.findOne({
      _id: id,
      isActive: true
    });
    
    if (!video) {
      return res.status(404).json({ success: false, message: 'ویدیو یافت نشد' });
    }
    
    // بررسی دسترسی بر اساس اشتراک
    const hasAccess = 
      (userSubscription === 'gold') ||
      (userSubscription === 'silver' && video.accessLevel !== 'gold') ||
      (userSubscription === 'bronze' && video.accessLevel === 'bronze');
    
    if (!hasAccess) {
      return res.status(403).json({ success: false, message: 'شما دسترسی به این ویدیو ندارید' });
    }
    
    res.json({ success: true, data: video });
  } catch (err) {
    res.status(500).json({ success: false, message: 'خطا در بارگذاری ویدیو' });
  }
};

module.exports = {
  getUserVideos,
  getVideoById
};