const UserProgress = require('../models/UserProgress')
const WorkoutPlan = require('../models/WorkoutPlan')
const User = require('../models/User')
const UserWorkout = require('../models/UserWorkout')
const mongoose = require('mongoose')

// --- GET progress for coach
const getProgress = async (req, res) => {
  try {
    const coachWorkouts = await WorkoutPlan.find({ createdBy: req.user._id }).select('_id title')
    if (!coachWorkouts.length) {
      return res.status(200).json({ success: true, progress: [] })
    }

    const workoutIds = coachWorkouts.map(w => w._id)
    const progressRecords = await UserProgress.find({ 
      workout: { $in: workoutIds } 
    })
      .populate('user', 'name')
      .populate('workout', 'title')
      .sort({ lastActivity: -1 })

    const progress = progressRecords.map(record => ({
      _id: record._id.toString(),
      user: {
        _id: record.user._id.toString(),
        name: record.user.name
      },
      workout: record.workout.title,
      completedDays: record.completedDays,
      totalDays: record.totalDays,
      lastActivity: record.lastActivity,
      status: record.status
    }))

    res.status(200).json({ success: true, progress })
  } catch (err) {
    console.error('Error in getProgress:', err)
    res.status(500).json({ success: false, message: 'خطا در بارگذاری پیشرفت' })
  }
}

// --- POST create progress record
const createProgress = async (req, res) => {
  try {
    const { userId, workoutId } = req.body

    // بررسی اینکه آیا این برنامه متعلق به این مربی هست
    const workout = await WorkoutPlan.findOne({ 
      _id: workoutId, 
      createdBy: req.user._id 
    })
    if (!workout) {
      return res.status(403).json({ success: false, message: 'شما دسترسی به این برنامه ندارید' })
    }

    // ایجاد رکورد پیشرفت
    const progress = await UserProgress.create({
      user: userId,
      workout: workoutId,
      totalDays: workout.duration,
      completedDays: 0,
      status: 'active'
    })

    res.status(201).json({ success: true, progress })
  } catch (err) {
    console.error('Error in createProgress:', err)
    res.status(500).json({ success: false, message: 'خطا در ایجاد پیشرفت' })
  }
}

// --- PUT update progress (when user completes a day)
const updateProgress = async (req, res) => {
  try {
    const { id } = req.params
    const { completedDays } = req.body

    // پیدا کردن رکورد و بررسی مالکیت
    const progress = await UserProgress.findById(id)
    if (!progress) {
      return res.status(404).json({ success: false, message: 'رکورد پیشرفت یافت نشد' })
    }

    // بررسی اینکه آیا این برنامه متعلق به این مربی هست
    const workout = await WorkoutPlan.findOne({ 
      _id: progress.workout, 
      createdBy: req.user._id 
    })
    if (!workout) {
      return res.status(403).json({ success: false, message: 'شما دسترسی به این رکورد ندارید' })
    }

    // به‌روزرسانی
    progress.completedDays = completedDays
    progress.lastActivity = new Date()
    
    // بررسی تکمیل شدن
    if (completedDays >= progress.totalDays) {
      progress.status = 'completed'
    }

    await progress.save()

    res.status(200).json({ success: true, progress })
  } catch (err) {
    console.error('Error in updateProgress:', err)
    res.status(500).json({ success: false, message: 'خطا در به‌روزرسانی پیشرفت' })
  }
}

const assignStudents = async (req, res) => {
  try {
    if (req.user.role !== "coach") {
      return res.status(403).json({
        success: false,
        message: "فقط مربی‌ها دسترسی دارند",
      });
    }

    const { studentId } = req.body;

    const student = await User.findOne({
      _id: studentId,
      role: "user",
      coach: null,
    }).populate("currentSubscription");

    // بررسی اعتبار اشتراک
    if (
      !student ||
      !student.currentSubscription ||
      !["silver", "gold"].includes(student.currentSubscription.plan) ||
      student.currentSubscription.status !== "active" ||
      new Date(student.currentSubscription.expiresAt) <= new Date()
    ) {
      return res.status(400).json({
        success: false,
        message: "کاربر قابل انتخاب نیست",
      });
    }

    student.coach = req.user.id;
    await student.save();

    res.json({
      success: true,
      message: "شاگرد با موفقیت انتخاب شد",
    });
  } catch (err) {
    console.error("Assign student error:", err);
    res.status(500).json({
      success: false,
      message: "خطای سرور",
    });
  }
}

const potentialStudents = async (req, res) => {
  try {
    if (req.user.role !== "coach") {
      return res.status(403).json({
        success: false,
        message: "فقط مربی‌ها دسترسی دارند",
      });
    }

    const users = await User.find({
      role: "user",
      coach: null,
      currentSubscription: { $exists: true, $ne: null },
    })
      .populate("currentSubscription")
      .select("name email currentSubscription");

    const potentialStudents = users.filter((user) => {
      const isValid =
        user.currentSubscription?.plan &&
        ["silver", "gold"].includes(user.currentSubscription.plan) &&
        user.currentSubscription.status === "active" &&
        new Date(user.currentSubscription.expiresAt) > new Date();

      console.log(
        "🔍 User:",
        user.name,
        "Valid:",
        isValid,
        "Subscription:",
        user.currentSubscription,
      );
      return isValid;
    });

    console.log("✅ Final result:", potentialStudents.length, "students");

    res.json({
      success: true,
      data: potentialStudents,
    });
  } catch (err) {
    console.error("❌ Potential students error:", err);
    res.status(500).json({
      success: false,
      message: "خطای سرور",
    });
  }
}

const students = async (req, res) => {
  try {
    console.log('🔍 DEBUG: Starting coach students route');
    console.log('🔍 DEBUG: Coach ID:', req.user.id);
    console.log('🔍 DEBUG: Coach Role:', req.user.role);

    if (req.user.role !== 'coach') {
      console.log('❌ DEBUG: Access denied - not a coach');
      return res.status(403).json({ 
        success: false, 
        message: 'فقط مربی‌ها دسترسی دارند' 
      });
    }

    // ✅ تبدیل به ObjectId برای مقایسه صحیح
    const coachId = new mongoose.Types.ObjectId(req.user.id);
    console.log('🔍 DEBUG: Querying students with coach:', coachId);

    const students = await User.find({
      role: 'user',
      coach: coachId
    })
    .populate('currentSubscription')
    .select('name email currentSubscription');
    
    console.log('🔍 DEBUG: Found students count:', students.length);

    const studentsWithWorkouts = await Promise.all(
      students.map(async (student) => {
        const userWorkouts = await UserWorkout.find({
          user: student._id,
          status: 'active'
        }).populate('workout', 'title duration isActive');
        
        const workoutPlans = userWorkouts.map(uw => ({
          _id: uw.workout._id.toString(),
          title: uw.workout.title,
          duration: uw.workout.duration,
          isActive: uw.workout.isActive
        }));

        return {
          _id: student._id.toString(),
          name: student.name,
          email: student.email,
          currentSubscription: student.currentSubscription,
          workoutPlans: workoutPlans
        };
      })
    );

    res.json({ 
      success: true, 
       data: studentsWithWorkouts 
    });
    
  } catch (err) {
    console.error('❌ ERROR in coach students route:', err);
    res.status(500).json({ 
      success: false, 
      message: 'خطای سرور' 
    });
  }
};

module.exports = {
  getProgress,
  createProgress,
  updateProgress,
  assignStudents,
  potentialStudents,
  students
}