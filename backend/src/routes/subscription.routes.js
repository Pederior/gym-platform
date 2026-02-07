// routes/subscription.routes.js
const express = require('express');
const { protect } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/role.middleware');
const { 
  getAdminPlans, 
  upsertPlan, 
  deletePlan 
} = require('../controllers/subscription.controller');

const router = express.Router();

router.use(protect, authorize('admin'));

router.get('/', getAdminPlans);
router.post('/', upsertPlan);
router.delete('/:id', deletePlan);

module.exports = router;