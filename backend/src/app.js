const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();

const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const workoutRoutes = require("./routes/workout.routes");
const classRoutes = require("./routes/class.routes");
const chatRoutes = require("./routes/chat.routes");
const financialRoutes = require("./routes/financial.routes");
const adminRoutes = require("./routes/admin.routes");
const logRoutes = require("./routes/log.routes");
const coachRoutes = require("./routes/coach.routes");
const userWorkoutRoutes = require("./routes/userWorkout.routes");
const notificationRoutes = require("./routes/notification.routes");
const paymentRoutes = require("./routes/payment.routes");
const productRoutes = require("./routes/product.routes");
const adminProductRoutes = require("./routes/productAdmin.routes");
const orderRoutes = require('./routes/order.routes');

const app = express();

// Middlewares
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? "https://fynixclub.vercel.app"
        : "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(helmet());

app.use('/uploads', (req, res, next) => {
  res.header('Cross-Origin-Resource-Policy', 'cross-origin');
  res.header('Cross-Origin-Embedder-Policy', 'require-corp');
  res.header('Access-Control-Allow-Origin', process.env.NODE_ENV === 'production' 
    ? 'https://fynixclub.vercel.app"' 
    : 'http://localhost:5173');
  res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
});

app.use(morgan("dev"));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Serve static files from uploads folder
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/workouts", workoutRoutes);
app.use("/api/user-workouts", userWorkoutRoutes);
app.use("/api/classes", classRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/coach", coachRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/products", productRoutes);
app.use("/api/admin/products", adminProductRoutes);
app.use('/api/orders', orderRoutes);

app.use("/api", financialRoutes);
app.use("/api", adminRoutes);
app.use("/api", logRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "OK" });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: "صفحه یافت نشد" });
});

module.exports = app;
