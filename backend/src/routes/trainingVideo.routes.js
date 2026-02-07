const express = require('express');
const { protect } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/role.middleware');
const { getCoachVideos, createVideo, updateVideo, deleteVideo } = require('../controllers/trainingVideo.controller');

const router = express.Router();

router.use(protect, authorize('coach'));

router.get('/', getCoachVideos);
router.post('/', createVideo);
router.put('/:id', updateVideo);
router.delete('/:id', deleteVideo);

module.exports = router;