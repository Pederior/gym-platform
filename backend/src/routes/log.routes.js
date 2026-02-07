const express = require('express');
const { protect } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/role.middleware');
const { getLogs } = require('../controllers/log.controller');

const router = express.Router();

router.use(protect, authorize('admin'));

router.get('/', getLogs); // GET /api/admin/logs

module.exports = router;