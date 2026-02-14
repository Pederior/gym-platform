const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "نام الزامی است"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "ایمیل الزامی است"],
      unique: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "ایمیل معتبر نیست"],
    },
    password: {
      type: String,
      required: [true, "رمز عبور الزامی است"],
      minlength: 6,
      select: false,
    },
    avatar: {
      type: String,
      default: null,
    },
    role: {
      type: String,
      enum: ["admin", "coach", "user"],
      default: "user",
    },
    coach: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      default: null,
    },
    currentSubscription: {
      type: mongoose.Schema.ObjectId,
      ref: "Subscription",
      default: null,
    },
    // workoutPlans: [{ type: mongoose.Schema.ObjectId, ref: "WorkoutPlan" }],
    reservedClasses: { type: mongoose.Schema.ObjectId, ref: "Class" },
  },
  { timestamps: true },
);

UserSchema.pre("save", async function () {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 12);
  }
});

UserSchema.methods.correctPassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password); 
};

module.exports = mongoose.model("User", UserSchema);
