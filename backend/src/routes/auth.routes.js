const express = require('express')
const { register, login } = require('../controllers/auth.controller')
const upload = require('../middleware/upload');
const User = require('../models/User');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router()

// PUT /api/auth/profile
router.put('/profile', protect, async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const userId = req.user.id;

    // پیدا کردن کاربر
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "کاربر یافت نشد" });
    }

    // آپدیت فیلدها
    user.name = name;
    user.email = email;
    
    // فقط اگر پسورد فرستاده شده
    if (password) {
      user.password = password; // ← middleware هش می‌کنه
    }

    await user.save(); // ← اینجا pre('save') فعال می‌شه

    const updatedUser = await User.findById(userId).select('-password');
    res.json({ success: true, user: updatedUser });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// PUT /api/auth/profile/avatar
router.put('/profile/avatar', protect, upload.single('avatar'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "فایل آواتار ارسال نشده" });
    }

    // آدرس فایل آپلود شده
    const avatarUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { avatar: avatarUrl },
      { new: true }
    ).select('-password');

    res.json({ success: true, user: updatedUser });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

router.route('/register').post(register)
router.route('/login').post(login)

module.exports = router