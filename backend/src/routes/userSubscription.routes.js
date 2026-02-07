// routes/userSubscription.routes.js
const express = require('express');
const { protect } = require('../middleware/auth.middleware');
const { getUserPlans } = require('../controllers/userSubscription.controller');

const router = express.Router();

router.use(protect);

router.get('/plans', getUserPlans);

module.exports = router;