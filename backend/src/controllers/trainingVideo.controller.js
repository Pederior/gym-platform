// controllers/trainingVideo.controller.js
const TrainingVideo = require("../models/TrainingVideo");
const User = require("../models/User");
const dotenv = require("dotenv");

// --- GET all videos for coach
const getCoachVideos = async (req, res) => {
  try {
    const videos = await TrainingVideo.find({
      createdBy: req.user._id,
    }).sort({ createdAt: -1 });

    res.json({ success: true, data: videos });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "خطا در بارگذاری ویدیوها" });
  }
};

// --- GET videos by id

const getVideosById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const video = await TrainingVideo.findOne({
      _id: id,
      createdBy: req.user._id
    });
    
    if (!video) {
      return res.status(404).json({ success: false, message: 'ویدیو یافت نشد' });
    }
    
    res.json({ success: true, data: video });
  } catch (err) {
    console.error('Get video error:', err);
    res.status(500).json({ success: false, message: 'خطا در بارگذاری ویدیو' });
  }
};

// --- POST create new video
const createVideo = async (req, res) => {
  try {
    const { title, description, duration, category, accessLevel, videoUrl } = req.body;
    
    if (videoUrl) {
      if (!videoUrl.trim()) {
        return res
          .status(400)
          .json({ success: false, message: "URL ویدیو نمی‌تواند خالی باشد" });
      }
      
      const video = await TrainingVideo.create({
        title,
        description,
        videoUrl: videoUrl.trim(),
        thumbnail: req.body.thumbnail || null,
        duration: parseInt(duration) || 0,
        category,
        accessLevel,
        createdBy: req.user._id,
      });
      
      return res.status(201).json({ success: true, video });
    }
    
    if (!req.files?.video) {
      return res
        .status(400)
        .json({ success: false, message: "فایل ویدیو الزامی است" });
    }

    const videoFile = req.files.video[0];
    const thumbnailFile = req.files.thumbnail?.[0];

    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const uploadedVideoUrl = `${baseUrl}/uploads/videos/${videoFile.filename}`;
    const uploadedThumbnailUrl = thumbnailFile
      ? `${baseUrl}/uploads/videos/${thumbnailFile.filename}`
      : null;

    const video = await TrainingVideo.create({
      title,
      description,
      videoUrl: uploadedVideoUrl,
      thumbnail: uploadedThumbnailUrl,
      duration: parseInt(duration) || 0,
      category,
      accessLevel,
      createdBy: req.user._id,
    });

    res.status(201).json({ success: true, video });
  } catch (err) {
    console.error("Upload video error:", err);
    res.status(500).json({ success: false, message: "خطا در ایجاد ویدیو" });
  }
};

// --- PUT update video
const updateVideo = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      videoUrl,
      thumbnail,
      duration,
      category,
      accessLevel,
      isActive 
    } = req.body;

    const isActiveValue = typeof isActive === 'boolean' 
      ? isActive 
      : isActive === 'true';

    const video = await TrainingVideo.findOneAndUpdate(
      { _id: id, createdBy: req.user._id },
      {
        title,
        description,
        videoUrl,
        thumbnail,
        duration,
        category,
        accessLevel,
        isActive: isActiveValue 
      },
      { new: true },
    );

    if (!video) {
      return res
        .status(404)
        .json({ success: false, message: "ویدیو یافت نشد" });
    }

    res.json({ success: true, data: video });
  } catch (err) {
    console.error('Update video error:', err); 
    res
      .status(500)
      .json({ success: false, message: "خطا در به‌روزرسانی ویدیو" });
  }
};

// --- DELETE video
const deleteVideo = async (req, res) => {
  try {
    const { id } = req.params;

    const video = await TrainingVideo.findOneAndDelete({
      _id: id,
      createdBy: req.user._id,
    });

    if (!video) {
      return res
        .status(404)
        .json({ success: false, message: "ویدیو یافت نشد" });
    }

    res.json({ success: true, message: "ویدیو با موفقیت حذف شد" });
  } catch (err) {
    res.status(500).json({ success: false, message: "خطا در حذف ویدیو" });
  }
};

module.exports = {
  getCoachVideos,
  createVideo,
  updateVideo,
  deleteVideo,
  getVideosById
};
