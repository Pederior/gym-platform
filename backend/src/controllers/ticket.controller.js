const Ticket = require('../models/Ticket');
const User = require('../models/User');

// --- GET user tickets
const getUserTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .populate('user', 'name email')
      .populate('admin', 'name email');
    
    res.json({ success: true,  tickets });
  } catch (err) {
    res.status(500).json({ success: false, message: 'خطا در بارگذاری تیکت‌ها' });
  }
};

// --- POST create new ticket
const createTicket = async (req, res) => {
  try {
    const { title, description, category, priority } = req.body;
    
    if (!title || !description) {
      return res.status(400).json({ success: false, message: 'عنوان و توضیحات الزامی هستند' });
    }
    
    const ticket = await Ticket.create({
      title,
      description,
      category,
      priority,
      user: req.user._id
    });
    
    res.status(201).json({ success: true, ticket });
  } catch (err) {
    res.status(500).json({ success: false, message: 'خطا در ایجاد تیکت' });
  }
};

// --- GET ticket by ID
const getTicketById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const ticket = await Ticket.findOne({
      _id: id,
      user: req.user._id
    })
    .populate('user', 'name email')
    .populate('admin', 'name email')
    .populate('messages.sender', 'name email role');
    
    if (!ticket) {
      return res.status(404).json({ success: false, message: 'تیکت یافت نشد' });
    }
    
    res.json({ success: true,  ticket });
  } catch (err) {
    res.status(500).json({ success: false, message: 'خطا در بارگذاری تیکت' });
  }
};

// --- POST add message to ticket
const addMessageToTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const { message } = req.body;
    
    if (!message?.trim()) {
      return res.status(400).json({ success: false, message: 'پیام نمی‌تواند خالی باشد' });
    }
    
    const ticket = await Ticket.findOneAndUpdate(
      { _id: id, user: req.user._id },
      {
        $push: {
          messages: {
            sender: req.user._id,
            message: message.trim()
          }
        },
        status: 'in_progress' 
      },
      { new: true }
    )
    .populate('user', 'name email')
    .populate('admin', 'name email')
    .populate('messages.sender', 'name email role');
    
    if (!ticket) {
      return res.status(404).json({ success: false, message: 'تیکت یافت نشد' });
    }
    
    res.json({ success: true,  ticket });
  } catch (err) {
    res.status(500).json({ success: false, message: 'خطا در ارسال پیام' });
  }
};

// --- PUT close ticket
const closeTicket = async (req, res) => {
  try {
    const { id } = req.params;
    
    const ticket = await Ticket.findOneAndUpdate(
      { _id: id, user: req.user._id },
      { status: 'closed' },
      { new: true }
    );
    
    if (!ticket) {
      return res.status(404).json({ success: false, message: 'تیکت یافت نشد' });
    }
    
    res.json({ success: true, message: 'تیکت با موفقیت بسته شد' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'خطا در بستن تیکت' });
  }
};

module.exports = {
  getUserTickets,
  createTicket,
  getTicketById,
  addMessageToTicket,
  closeTicket
};