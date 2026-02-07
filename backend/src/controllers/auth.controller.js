const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

const register = async (req, res) => {
  const { name, email, password, role = "user" } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    return res
      .status(400)
      .json({ success: false, message: "کاربری با این ایمیل وجود دارد" });
  }

  // فقط مدیر می‌تونه مربی یا مدیر ایجاد کنه (در production)
  const finalRole = role === "coach" || role === "admin" ? "user" : role;

  const user = await User.create({ name, email, password, role: finalRole });
  const token = generateToken(user._id);

  res.status(201).json({
    success: true,
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  console.log("Login attempt:", { email, passwordLength: password?.length });

  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    console.log("User not found for email:", email);
    return res
      .status(401)
      .json({ success: false, message: "ایمیل یا رمز عبور اشتباه است" });
  }

  console.log(
    "User found:",
    user._id,
    "Password hash length:",
    user.password?.length,
  );

  const isPasswordCorrect = await user.correctPassword(password);
  console.log("Password correct:", isPasswordCorrect);

  if (!isPasswordCorrect) {
    return res
      .status(401)
      .json({ success: false, message: "ایمیل یا رمز عبور اشتباه است" });
  }
  const token = generateToken(user._id);

  res.status(200).json({
    success: true,
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
    },
  });
};

module.exports = { register, login };
