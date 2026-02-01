const Subscription = require('../models/Subscription')
const Invoice = require('../models/Invoice')
const Payment = require('../models/Payment')
const User = require('../models/User')

// --- Subscriptions ---
const getSubscriptions = async (req, res) => {
  try {
    const subscriptions = await Subscription.find()
      .populate('user', 'name')
      .sort({ createdAt: -1 })
    res.status(200).json({ success: true, subscriptions })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

// --- Invoices ---
const getInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find()
      .populate('user', 'name')
      .sort({ dueDate: -1 })
    res.status(200).json({ success: true, invoices })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

// --- Payments ---
const getPayments = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate('user', 'name')
      .sort({ createdAt: -1 })
    res.status(200).json({ success: true, payments })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

// --- Financial Report ---
const getFinancialReport = async (req, res) => {
  try {
    // درآمد ماهانه
    const monthlyRevenue = await Payment.aggregate([
      {
        $match: {
          status: 'completed',
          createdAt: {
            $gte: new Date(new Date().setMonth(new Date().getMonth() - 1)),
            $lt: new Date()
          }
        }
      },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ])

    // اشتراک‌های فعال
    const activeSubscriptions = await Subscription.countDocuments({ status: 'active' })

    // تعداد کاربران
    const totalUsers = await User.countDocuments()

    // نرخ موفقیت پرداخت
    const totalPayments = await Payment.countDocuments()
    const successfulPayments = await Payment.countDocuments({ status: 'completed' })
    const paymentSuccessRate = totalPayments > 0 
      ? Math.round((successfulPayments / totalPayments) * 100) 
      : 0

    res.status(200).json({
      success: true,
      report: {
        monthlyRevenue: monthlyRevenue[0]?.total || 0,
        activeSubscriptions,
        totalUsers,
        paymentSuccessRate
      }
    })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

module.exports = {
  getSubscriptions,
  getInvoices,
  getPayments,
  getFinancialReport
}