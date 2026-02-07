// routes/userSubscription.routes.js
const express = require('express');
const { protect } = require('../middleware/auth.middleware');
const { getUserPlans } = require('../controllers/userSubscription.controller');
// const { createActivityLogger } = require('../middleware/activityLogger');

const router = express.Router();

router.use(protect);

router.get('/plans', getUserPlans);

// For Logging
// router.post(
//   '/subscription',
//   protect,
//   createActivityLogger(
//     'create_subscription',
//     (req) => `خرید اشتراک ${req.body.planId} - ${req.body.duration}`,
//     (req) => ({ planId: req.body.planId, duration: req.body.duration })
//   ),
//   createSubscription
// );

module.exports = router;