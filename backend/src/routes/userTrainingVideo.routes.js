const express = require('express');
const { protect } = require('../middleware/auth.middleware');
const { getUserVideos, getVideoById } = require('../controllers/userTrainingVideo.controller');

const router = express.Router();

router.use(protect);

router.get('/', getUserVideos);
router.get('/:id', getVideoById);

module.exports = router;