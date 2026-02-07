const express = require('express');
const { protect } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/role.middleware');
const {
  getDietPlans,
  createDietPlan,
  getDietPlanById,
  updateDietPlan,
  deleteDietPlan,
  assignDietPlan,
  getAssignedUsers
} = require('../controllers/dietPlan.controller');

const router = express.Router();

// فقط مربی‌ها دسترسی دارن
router.use(protect, authorize('coach'));

// CRUD برنامه‌های غذایی
router.get('/', getDietPlans);                           // GET /api/diet-plans
router.post('/', createDietPlan);                       // POST /api/diet-plans
router.get('/:id', getDietPlanById);                   // GET /api/diet-plans/:id
router.put('/:id', updateDietPlan);                    // PUT /api/diet-plans/:id
router.delete('/:id', deleteDietPlan);                 // DELETE /api/diet-plans/:id

// اختصاص و مدیریت کاربران
router.post('/assign', assignDietPlan);                // POST /api/diet-plans/assign
router.get('/:dietPlanId/users', getAssignedUsers);   // GET /api/diet-plans/:id/users

module.exports = router;