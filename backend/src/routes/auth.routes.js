const express = require('express');
const { register, login, logout } = require('../controllers/auth.controller');
const upload = require('../middleware/upload');
const User = require('../models/User');
const { protect } = require('../middleware/auth.middleware');
const { createActivityLogger } = require('../middleware/activityLogger');

const router = express.Router();

// PUT /api/auth/profile
router.put('/profile', protect, async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "کاربر یافت نشد" });
    }

    user.name = name;
    user.email = email;
    
    if (password) {
      user.password = password;
    }

    await user.save();
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

// POST /api/auth/register
router.post(
  '/register', 
  createActivityLogger(
    'register',
    (req) => `ثبت‌نام کاربر جدید: ${req.body.email}`,
    (req) => ({ email: req.body.email, name: req.body.name })
  ),
  register
);

// POST /api/auth/login  
router.post(
  '/login',
  createActivityLogger(
    'login',
    (req) => `ورود کاربر: ${req.body.email}`,
    (req, res) => ({ email: req.body.email, ip: req.ip })
  ),
  login
);

// POST /api/auth/logout
router.post(
  '/logout',
  protect,
  createActivityLogger('logout', (req) => `خروج کاربر: ${req.user.email}`),
  logout 
);


module.exports = router;