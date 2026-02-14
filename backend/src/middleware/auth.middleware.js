const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes - Check if user is authenticated
const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      req.user = await User.findById(decoded.id).select('-password');
      
      if (!req.user) {
        return res.status(401).json({ 
          success: false, 
          message: 'کاربر معتبر نیست' 
        });
      }
      
      next();
    } catch (err) {
      console.error('Auth error:', err);
      return res.status(401).json({ 
        success: false, 
        message: 'توکن نامعتبر است' 
      });
    }
  } else {
    return res.status(401).json({ 
      success: false, 
      message: 'دسترسی غیرمجاز' 
    });
  }
};

// Admin middleware - Check if user is admin
const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({ 
      success: false, 
      message: 'دسترسی فقط برای ادمین‌ها مجاز است' 
    });
  }
};

module.exports = { protect, admin };