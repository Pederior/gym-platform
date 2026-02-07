const express = require("express");
const { protect } = require("../middleware/auth.middleware");
const { authorize } = require("../middleware/role.middleware");
const {
  getCoachVideos,
  createVideo,
  updateVideo,
  deleteVideo,
  getVideosById,
} = require("../controllers/trainingVideo.controller");
const upload = require("../middleware/upload.middleware");
const router = express.Router();
const TrainingVideo = require("../models/TrainingVideo");

router.use(protect, authorize("coach"));

router.get("/", getCoachVideos);
router.post("/", createVideo);
router.get("/:id", getVideosById);
router.put("/:id", updateVideo);
router.delete("/:id", deleteVideo);

// POST /api/coach/videos/upload
router.post(
  "/upload",
  upload.fields([
    { name: "video", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const { title, description, duration, category, accessLevel } = req.body;

      // بررسی وجود فایل ویدیو
      if (!req.files?.video) {
        return res
          .status(400)
          .json({ success: false, message: "فایل ویدیو الزامی است" });
      }

      const videoFile = req.files.video[0];
      const thumbnailFile = req.files.thumbnail?.[0];

      // ذخیره اطلاعات ویدیو
      const video = await TrainingVideo.create({
        title,
        description,
        videoUrl: `/uploads/videos/${videoFile.filename}`,
        thumbnail: thumbnailFile
          ? `/uploads/videos/${thumbnailFile.filename}`
          : null,
        duration: parseInt(duration) || 0,
        category,
        accessLevel,
        createdBy: req.user._id,
      });

      res.status(201).json({ success: true, video });
    } catch (err) {
      console.error("Upload video error:", err);
      res.status(500).json({ success: false, message: "خطا در آپلود ویدیو" });
    }
  },
);
module.exports = router;
