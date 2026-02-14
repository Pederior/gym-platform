const TrainingVideo = require('../models/TrainingVideo');
const Subscription = require('../models/Subscription'); 

// --- GET videos available to user based on subscription
const getUserVideos = async (req, res) => {
  try {
    let userLevel = 'bronze'; 
    
    const activeSubscription = await Subscription.findOne({
      user: req.user._id,
      status: 'active'
    });
    
    if (activeSubscription) {
      userLevel = activeSubscription.plan; 
    }
    
    let allowedLevels = [];
    if (userLevel === 'gold') {
      allowedLevels = ['bronze', 'silver', 'gold'];
    } else if (userLevel === 'silver') {
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
    console.error('Get user videos error:', err);
    res.status(500).json({ success: false, message: 'خطا در بارگذاری ویدیوها' });
  }
};

// --- GET single video by ID
const getVideoById = async (req, res) => {
  try {
    const { id } = req.params;
    
    let userLevel = 'bronze';
    const activeSubscription = await Subscription.findOne({
      user: req.user._id,
      status: 'active'
    });
    
    if (activeSubscription) {
      userLevel = activeSubscription.plan;
    }
    
    const video = await TrainingVideo.findOne({
      _id: id,
      isActive: true
    });
    
    if (!video) {
      return res.status(404).json({ success: false, message: 'ویدیو یافت نشد' });
    }
    
    const hasAccess = 
      (userLevel === 'gold') ||
      (userLevel === 'silver' && video.accessLevel !== 'gold') ||
      (userLevel === 'bronze' && video.accessLevel === 'bronze');
    
    if (!hasAccess) {
      return res.status(403).json({ success: false, message: 'شما دسترسی به این ویدیو ندارید' });
    }
    
    res.json({ success: true, data: video });
  } catch (err) {
    console.error('Get video by ID error:', err);
    res.status(500).json({ success: false, message: 'خطا در بارگذاری ویدیو' });
  }
};

module.exports = {
  getUserVideos,
  getVideoById
};