// routes/coachComment.routes.js
const express = require('express');
const { protect } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/role.middleware');
const {
  getCoachComments,
  replyToComment,
  deleteCoachComment
} = require('../controllers/coachComment.controller');

const router = express.Router();

router.use(protect, authorize('coach'));

router.get('/', getCoachComments);              // GET /api/coach/comments
router.post('/reply', replyToComment);         // POST /api/coach/comments/reply
router.delete('/:id', deleteCoachComment);     // DELETE /api/coach/comments/:id

module.exports = router;