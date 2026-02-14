const app = require("./src/app");
const dotenv = require("dotenv");
const connectDB = require("./src/config/db");
const http = require("http");
const socketIo = require("socket.io");
const Message = require("./src/models/Message");
const User = require("./src/models/User");
const Notification = require("./src/models/Notification");
const mongoose = require('mongoose');

dotenv.config();
connectDB();

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

const io = socketIo(server, {
  cors: {
    origin: function (origin, callback) {
      const allowedOrigins = [
        "https://fynixclub.vercel.app",
        "https://fynixclub-872myzubz-ahdreza2000-8103s-projects.vercel.app",
        "http://localhost:5173"
      ];
      
      if (!origin) return callback(null, true);
      
      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST"],
    credentials: true
  },
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join", (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined`);
  });

  socket.on("send_message", async (data) => {
    try {
      const { senderId, receiverId, content } = data;

      const message = new Message({
        sender: senderId,
        receiver: receiverId,
        content,
      });
      await message.save();
      
      const senderUser = await User.findById(senderId);
      const senderRole = senderUser?.role === "coach" ? "coach" : "user";

      await Notification.create({
        userId: receiverId,
        type: "chat",
        message: "پیام جدیدی در چت دریافت کردید",
        relatedId: senderId,
        senderName: senderUser?.name || "ناشناس", 
        senderRole: senderUser?.role || "user",
      });

      io.to(receiverId).emit("receive_message", {
        _id: message._id.toString(),
        sender: senderRole,
        content: message.content,
        timestamp: message.createdAt,
        read: false,
      });

      io.to(senderId).emit("message_sent", {
        _id: message._id.toString(),
        sender: senderRole,
        content: message.content,
        timestamp: message.createdAt,
        read: false,
      });
    } catch (err) {
      console.error("Error sending message:", err);
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`✅ Server running on ${PORT}`);
});

process.on("unhandledRejection", (err, promise) => {
  console.log(`❌ Unhandled Rejection: ${err.message}`);
  server.close(() => process.exit(1));
});
