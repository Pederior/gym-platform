// controllers/trainingVideo.controller.js
const TrainingVideo = require('../models/TrainingVideo');
const User = require('../models/User');

// --- GET all videos for coach
const getCoachVideos = async (req, res) => {
  try {
    const videos = await TrainingVideo.find({ 
      createdBy: req.user._id 
    }).sort({ createdAt: -1 });
    
    res.json({ success: true, data: videos });
  } catch (err) {
    res.status(500).json({ success: false, message: 'خطا در بارگذاری ویدیوها' });
  }
};

// --- POST create new video
const createVideo = async (req, res) => {
  try {
    const { title, description, videoUrl, thumbnail, duration, category, accessLevel } = req.body;
    
    const video = await TrainingVideo.create({
      title,
      description,
      videoUrl,
      thumbnail,
      duration,
      category,
      accessLevel,
      createdBy: req.user._id
    });
    
    res.status(201).json({ success: true, data: video });
  } catch (err) {
    res.status(500).json({ success: false, message: 'خطا در ایجاد ویدیو' });
  }
};

// --- PUT update video
const updateVideo = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, videoUrl, thumbnail, duration, category, accessLevel } = req.body;
    
    const video = await TrainingVideo.findOneAndUpdate(
      { _id: id, createdBy: req.user._id },
      { title, description, videoUrl, thumbnail, duration, category, accessLevel },
      { new: true }
    );
    
    if (!video) {
      return res.status(404).json({ success: false, message: 'ویدیو یافت نشد' });
    }
    
    res.json({ success: true, data:video });
  } catch (err) {
    res.status(500).json({ success: false, message: 'خطا در به‌روزرسانی ویدیو' });
  }
};

// --- DELETE video
const deleteVideo = async (req, res) => {
  try {
    const { id } = req.params;
    
    const video = await TrainingVideo.findOneAndDelete({
      _id: id,
      createdBy: req.user._id
    });
    
    if (!video) {
      return res.status(404).json({ success: false, message: 'ویدیو یافت نشد' });
    }
    
    res.json({ success: true, message: 'ویدیو با موفقیت حذف شد' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'خطا در حذف ویدیو' });
  }
};

module.exports = {
  getCoachVideos,
  createVideo,
  updateVideo,
  deleteVideo
};