const WorkoutPlan = require("../models/WorkoutPlan");
const UserWorkout = require("../models/UserWorkout");
const User = require("../models/User");
const mongoose = require("mongoose");

// --- GET all workouts (for coach)
const getWorkouts = async (req, res) => {
  try {
    const workouts = await WorkoutPlan.find({ createdBy: req.user._id });
    res.status(200).json({ success: true, workouts });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// --- POST create workout
const createWorkout = async (req, res) => {
  try {
    const { title, description, duration, exercises } = req.body;

    const workout = await WorkoutPlan.create({
      title,
      description,
      duration,
      exercises,
      createdBy: req.user._id,
    });

    res.status(201).json({ success: true, workout });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// --- PUT update workout
const updateWorkout = async (req, res) => {
  try {
    const { title, description, duration, exercises } = req.body;

    const workout = await WorkoutPlan.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user._id },
      { title, description, duration, exercises },
      { new: true, runValidators: true },
    );

    if (!workout) {
      return res
        .status(404)
        .json({ success: false, message: "برنامه یافت نشد" });
    }

    res.status(200).json({ success: true, workout });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// --- DELETE workout
const deleteWorkout = async (req, res) => {
  try {
    const workout = await WorkoutPlan.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.user._id,
    });

    if (!workout) {
      return res
        .status(404)
        .json({ success: false, message: "برنامه یافت نشد" });
    }

    res.status(200).json({ success: true, message: "برنامه با موفقیت حذف شد" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getWorkoutUsers = async (req, res) => {
  try {
    const { id } = req.params 
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'آیدی نامعتبر' })
    }

    const workout = await WorkoutPlan.findOne({
      _id: id, 
      createdBy: req.user._id
    })

    if (!workout) {
      return res.status(403).json({ success: false, message: 'دسترسی غیرمجاز' })
    }

    const userWorkouts = await UserWorkout.find({
      workout: id, 
      status: "active",
    }).populate("user", "name")

    const users = userWorkouts.map((uw) => ({
      _id: uw.user._id.toString(),
      name: uw.user.name,
    }))

    res.status(200).json({ success: true, users })
  } catch (err) {
    console.error("Get workout users error:", err)
    res.status(500).json({ success: false, message: err.message })
  }
}



module.exports = {
  getWorkouts,
  createWorkout,
  updateWorkout,
  deleteWorkout,
  getWorkoutUsers,
};
