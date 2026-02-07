const express = require("express");
const { protect } = require("../middleware/auth.middleware");
const { authorize } = require("../middleware/role.middleware");
const {
  getProgress,
  createProgress,
  updateProgress,
  assignStudents,
  potentialStudents,
  students
} = require("../controllers/coach.controller");
const User = require("../models/User");
const UserWorkout = require("../models/UserWorkout");
const DietPlan = require("../models/DietPlan");
const UserDietPlan = require("../models/UserDietPlan");
const router = express.Router();

// فقط مربی‌ها
router.use(protect, authorize("coach"));

// GET /api/coach/progress → لیست پیشرفت
router.get("/progress", getProgress);

// POST /api/coach/progress → ایجاد رکورد پیشرفت
router.post("/progress", createProgress);

// PUT /api/coach/progress/:id → به‌روزرسانی پیشرفت
router.put("/progress/:id", updateProgress);

// POST /api/coach/assign-student
router.post("/assign-student", assignStudents);

// GET /api/coach/potential-students
router.get("/potential-students", potentialStudents);

// GET /api/coach/students
router.get('/students', students);


module.exports = router;
