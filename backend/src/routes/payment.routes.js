const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/payment.controller');
const { protect } = require('../middleware/auth.middleware');

router.use(protect);

router.get('/', paymentController.getUserPayments);
router.get('/:id', paymentController.getPaymentById);

module.exports = router;