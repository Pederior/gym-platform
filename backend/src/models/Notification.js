const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["chat", "class_registration", "workout_assigned"],
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    relatedId: {
      type: mongoose.Schema.ObjectId,
      ref: "User", 
      required: true,
    },
    read: {
      type: Boolean,
      default: false,
    },
    senderName: {
      type: String,
      default: "ناشناس",
    },
    senderRole: {
      type: String,
      enum: ["user", "coach", "admin"],
      default: "user",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Notification", NotificationSchema);
