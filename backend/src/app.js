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
const logRoutes = require('./routes/log.routes');
const coachRoutes = require("./routes/coach.routes");
const userWorkoutRoutes = require("./routes/userWorkout.routes");
const notificationRoutes = require("./routes/notification.routes");
const paymentRoutes = require("./routes/payment.routes");
const productRoutes = require("./routes/product.routes");
const adminProductRoutes = require("./routes/productAdmin.routes");
const orderRoutes = require('./routes/order.routes');
const dashboardRoutes = require('./routes/dashboard.routes');
const dietPlanRoutes = require('./routes/dietPlan.routes');
const trainingVideoRoutes = require('./routes/trainingVideo.routes');
const userTrainingVideoRoutes = require('./routes/userTrainingVideo.routes');
const subscriptionRoutes = require('./routes/subscription.routes');
const userSubscriptionRoutes = require('./routes/userSubscription.routes');
const ticketRoutes = require('./routes/ticket.routes');
const adminTicketRoutes = require('./routes/adminTicket.routes');
const articleRoutes = require('./routes/article.routes');
const coachArticleRoutes = require('./routes/coachArticle.routes');
const adminArticleRoutes = require('./routes/adminArticle.routes');
const commentRoutes = require('./routes/comment.routes');
const uploadRoutes = require('./routes/upload.routes');
const adminCommentRoutes = require('./routes/adminComment.routes');
const coachCommentRoutes = require('./routes/coachComment.routes');

const app = express();

const allowedOrigins = [
  "https://fynixclub.vercel.app",
  "https://fynixclub-872myzubz-ahdreza2000-8103s-projects.vercel.app"
];

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
app.use('/api/dashboard', dashboardRoutes);
app.use("/api/diet-plans", dietPlanRoutes);
app.use("/api/coach/videos", trainingVideoRoutes);
app.use("/api/user/videos", userTrainingVideoRoutes);
app.use("/api/admin/subscriptions", subscriptionRoutes);
app.use("/api/subscriptions", userSubscriptionRoutes); 
app.use("/api/tickets", ticketRoutes);           
app.use("/api/admin/tickets", adminTicketRoutes);
app.use("/api/articles", articleRoutes);
app.use("/api/coach/articles", coachArticleRoutes);
app.use("/api/admin/articles", adminArticleRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/admin/comments", adminCommentRoutes);
app.use("/api/coach/comments", coachCommentRoutes);

app.use("/api/financial", financialRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/admin/logs", logRoutes);


// Upload
app.use("/api/upload", uploadRoutes);
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Health check
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "OK" });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: "صفحه یافت نشد" });
});

module.exports = app;
