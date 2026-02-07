const mongoose = require("mongoose");

const UserWorkoutSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    workout: {
      // ← تغییر به workout (همانند داده‌های واقعی)
      type: mongoose.Schema.ObjectId,
      ref: "WorkoutPlan",
      required: true,
    },
    assignedBy: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    endDate: {
      type: Date,
    },
    status: {
      type: String,
      enum: ["active", "completed", "paused"],
      default: "active",
    },
    progress: {
      completedDays: { type: Number, default: 0 },
      totalDays: { type: Number, required: true },
    },
  },
  { timestamps: true },
);

// اطمینان از عدم تکراری بودن
UserWorkoutSchema.index({ user: 1, workout: 1 }, { unique: true });

module.exports = mongoose.model("UserWorkout", UserWorkoutSchema);
