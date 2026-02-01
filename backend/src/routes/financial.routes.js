const express = require('express')
const { protect } = require('../middleware/auth.middleware')
const { authorize } = require('../middleware/role.middleware')
const {
  getSubscriptions,
  getInvoices,
  getPayments,
  getFinancialReport
} = require('../controllers/financial.controller')

const router = express.Router()

// فقط مدیر دسترسی داره
router.use(protect, authorize('admin'))

router.get('/subscriptions', getSubscriptions)
router.get('/invoices', getInvoices)
router.get('/payments', getPayments)
router.get('/reports/financial', getFinancialReport)

module.exports = router