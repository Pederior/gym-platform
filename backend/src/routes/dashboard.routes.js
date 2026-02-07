const express = require('express');
const { protect, admin } = require('../middleware/auth.middleware');
const User = require('../models/User');
const Payment = require('../models/Payment');
const Class = require('../models/Class');
const Order = require('../models/Order');
const WorkoutPlan = require('../models/WorkoutPlan');

const router = express.Router();

router.get('/admin/summary', protect, admin, async (req, res) => {
  try {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const [
      activeUsers,
      monthlyRevenue,
      activeClasses,
      newOrders
    ] = await Promise.all([
      User.countDocuments({ 
        'currentSubscription.endDate': { $gt: new Date() } 
      }),
      
      Payment.aggregate([
        { 
          $match: { 
            status: 'completed',
            createdAt: { $gte: startOfMonth }
          }
        },
        { 
          $group: { _id: null, total: { $sum: '$amount' } }
        }
      ]),
      
      Class.countDocuments({ 
        dateTime: { $gt: new Date() } 
      }),
      
      Order.countDocuments({ 
        createdAt: { $gte: last24Hours }
      })
    ]);

    const recentActivities = [
      { message: "ثبت‌نام کاربر جدید", time: "۲ ساعت پیش" },
      { message: "پرداخت موفق: ۱,۲۰۰,۰۰۰ تومان", time: "۵ ساعت پیش" },
      { message: "رزرو کلاس توسط کاربر", time: "دیروز" }
    ];

    res.json({
      success: true,
      data: {
        activeUsers,
        monthlyRevenue: monthlyRevenue[0]?.total || 0,
        activeClasses,
        newOrders,
        recentActivities
      }
    });
  } catch (err) {
    console.error('Dashboard error:', err);
    res.status(500).json({ 
      success: false, 
      message: "خطای سرور" 
    });
  }
});

router.get('/coach/summary', protect, async (req, res) => {
  try {
    if (req.user.role !== 'coach') {
      return res.status(403).json({ success: false, message: 'دسترسی غیرمجاز' });
    }

    const [
      supervisedUsers,
      createdWorkouts,
      activeClasses
    ] = await Promise.all([
      User.countDocuments({ coach: req.user.id }),
      WorkoutPlan.countDocuments({ createdBy: req.user.id }),
      Class.countDocuments({ 
        coach: req.user.id, 
        dateTime: { $gt: new Date() } 
      })
    ]);

    res.json({
      success: true,
      data: {
        supervisedUsers,
        createdWorkouts,
        activeClasses
      }
    });
  } catch (err) {
    console.error('Coach dashboard error:', err);
    res.status(500).json({ success: false, message: 'خطای سرور' });
  }
});

// router.get('/user/summary', protect, async (req, res) => {
//   try {
//     if (req.user.role !== 'user') {
//       return res.status(403).json({ success: false, message: 'دسترسی غیرمجاز' });
//     }

//     const [
//       completedWorkouts,
//       activeClasses
//     ] = await Promise.all([
//       UserWorkout.countDocuments({ user: req.user.id, status: 'completed' }),
//       Class.countDocuments({ 
//         dateTime: { $gt: new Date() }, 
//         students: req.user.id 
//       })
//     ]);  

//     res.json({
//       success: true,
//       data: {
//         completedWorkouts,
//         activeClasses
//       }
//     });
//   } catch (err) {
//     console.error('User dashboard error:', err);
//     res.status(500).json({ success: false, message: 'خطای سرور' });
//   }
// });


module.exports = router;