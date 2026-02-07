// controllers/adminTicket.controller.js
const Ticket = require('../models/Ticket');
const User = require('../models/User');

// --- GET all tickets for admin
const getAdminTickets = async (req, res) => {
  try {
    const { status, category, priority } = req.query;
    const query = {};
    
    if (status) query.status = status;
    if (category) query.category = category;
    if (priority) query.priority = priority;
    
    const tickets = await Ticket.find(query)
      .sort({ createdAt: -1 })
      .populate('user', 'name email')
      .populate('admin', 'name email');
    
    res.json({ success: true,  tickets });
  } catch (err) {
    res.status(500).json({ success: false, message: 'خطا در بارگذاری تیکت‌ها' });
  }
};

// --- GET ticket by ID for admin
const getAdminTicketById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const ticket = await Ticket.findById(id)
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

// --- POST assign admin to ticket
const assignAdminToTicket = async (req, res) => {
  try {
    const { id } = req.params;
    
    const ticket = await Ticket.findByIdAndUpdate(
      id,
      { 
        admin: req.user._id,
        status: 'in_progress'
      },
      { new: true }
    );
    
    if (!ticket) {
      return res.status(404).json({ success: false, message: 'تیکت یافت نشد' });
    }
    
    res.json({ success: true, message: 'تیکت به شما اختصاص داده شد' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'خطا در اختصاص تیکت' });
  }
};

// --- POST add admin message to ticket
const addAdminMessageToTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const { message } = req.body;
    
    if (!message?.trim()) {
      return res.status(400).json({ success: false, message: 'پیام نمی‌تواند خالی باشد' });
    }
    
    const ticket = await Ticket.findByIdAndUpdate(
      id,
      {
        $push: {
          messages: {
            sender: req.user._id,
            message: message.trim()
          }
        }
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

// --- PUT resolve ticket
const resolveTicket = async (req, res) => {
  try {
    const { id } = req.params;
    
    const ticket = await Ticket.findByIdAndUpdate(
      id,
      { status: 'resolved' },
      { new: true }
    );
    
    if (!ticket) {
      return res.status(404).json({ success: false, message: 'تیکت یافت نشد' });
    }
    
    res.json({ success: true, message: 'تیکت با موفقیت حل شد' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'خطا در حل تیکت' });
  }
};

module.exports = {
  getAdminTickets,
  getAdminTicketById,
  assignAdminToTicket,
  addAdminMessageToTicket,
  resolveTicket
};