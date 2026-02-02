// middleware/auth.middleware.js

const jwt = require('jsonwebtoken')
const User = require('../models/User')

// Protect routes - Check if user is authenticated
const protect = async (req, res, next) => {
  let token

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // گرفتن توکن
      token = req.headers.authorization.split(' ')[1]
      
      // دیکد کردن توکن
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      
      // گرفتن اطلاعات کاربر
      req.user = await User.findById(decoded.id).select('-password')
      
      // ✅ بررسی وجود کاربر
      if (!req.user) {
        return res.status(401).json({ 
          success: false, 
          message: 'کاربر معتبر نیست' 
        })
      }
      
      next()
    } catch (err) {
      console.error('Auth error:', err)
      return res.status(401).json({ 
        success: false, 
        message: 'توکن نامعتبر است' 
      })
    }
  } else {
    return res.status(401).json({ 
      success: false, 
      message: 'دسترسی غیرمجاز' 
    })
  }
}

// Admin middleware - Check if user is admin
const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next()
  } else {
    return res.status(403).json({ 
      success: false, 
      message: 'دسترسی فقط برای ادمین‌ها مجاز است' 
    })
  }
}

const isMatch = await bcrypt.compare(password, user.password);
console.log("Password match:", isMatch); // ← این خط رو اضافه کن
console.log("Input password:", password);
console.log("Stored hash:", user.password);

if (!isMatch) {
  return res.status(400).json({ message: "ایمیل یا رمز عبور اشتباه است" });
}

module.exports = { protect, admin }