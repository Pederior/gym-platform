const authorize = (...roles) => {
  return (req, res, next) => {
    console.log('🔍 Debug Auth:')
    console.log('User ID:', req.user?._id)
    console.log('User Role:', req.user?.role)
    console.log('Allowed Roles:', roles)
    console.log('Has Access:', roles.includes(req.user?.role))

    if (!req.user) {
      return res.status(401).json({ success: false, message: 'کاربر یافت نشد' })
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false, 
        message: `دسترسی محدود به: ${roles.join(', ')}` 
      })
    }
    next()
  }
}

module.exports = { authorize }