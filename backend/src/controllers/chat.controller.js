const Message = require("../models/Message");
const User = require("../models/User");
const getMessages = async (req, res) => {
  try {
    const { receiverId } = req.params;
    const senderId = req.user._id;

    const messages = await Message.find({
      $or: [
        { sender: senderId, receiver: receiverId },
        { sender: receiverId, receiver: senderId },
      ],
    })
      .populate("sender", "name")
      .populate("receiver", "name")
      .sort({ createdAt: 1 });

    const formattedMessages = messages.map((msg) => ({
      _id: msg._id.toString(),
      sender:
        msg.sender._id.toString() === senderId.toString() ? "coach" : "user", 
      content: msg.content, 
      timestamp: msg.createdAt,
      read: msg.read,
    }));

    res.status(200).json({ success: true, messages: formattedMessages });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const sendMessage = async (req, res) => {
  try {
    const { receiverId, content } = req.body; 
    const senderId = req.user._id;

    const message = await Message.create({
      sender: senderId,
      receiver: receiverId,
      content, 
    });

    const formattedMessage = {
      _id: message._id.toString(),
      sender: "coach",
      content: message.content,
      timestamp: message.createdAt,
      read: message.read,
    };

    res.status(201).json({ success: true, message: formattedMessage });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


//TODO: change it to this in future
// const getChatUsers = async (req, res) => {
//   try {
//     // پیدا کردن کاربرانی که برنامه از این مربی دارن
//     const workoutPlans = await WorkoutPlan.find({ 
//       createdBy: req.user._id 
//     }).select('user')
    
//     const userIds = workoutPlans.map(plan => plan.user)
    
//     const users = await User.find({ 
//       _id: { $in: userIds },
//       role: 'user'
//     }).select('name')

//     res.status(200).json({ success: true, users })
//   } catch (err) {
//     console.error('Chat users error:', err)
//     res.status(500).json({ success: false, message: 'خطا در بارگذاری لیست کاربران' })
//   }
// }

const getChatUsers = async (req, res) => {
  try {
    const userIds = await Message.distinct('sender', { 
      receiver: req.user._id
    })

    const users = await User.find({ 
      _id: { $in: userIds },
      role: 'user'
    }).select('name')

    res.status(200).json({ success: true, users })
  } catch (err) {
    console.error('Chat users error:', err)
    res.status(500).json({ success: false, message: 'خطا در بارگذاری لیست کاربران' })
  }
}
const getChatCoaches = async (req, res) => {
  try {
    const coachIds = await Message.distinct('sender', { 
      receiver: req.user._id
    })

    const coaches = await User.find({ 
      _id: { $in: coachIds },
      role: 'coach'
    }).select('name')

    res.status(200).json({ success: true, coaches })
  } catch (err) {
    console.error('Chat coaches error:', err)
    res.status(500).json({ success: false, message: 'خطا در بارگذاری لیست مربی‌ها' })
  }
}

module.exports = { getMessages, sendMessage, getChatUsers,getChatCoaches};
