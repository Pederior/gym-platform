const express = require('express');
const { protect } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/role.middleware');
const {
  getAdminComments,
  updateCommentStatus,
  deleteAnyComment,
  replyToComment
} = require('../controllers/adminComment.controller');

const router = express.Router();

router.use(protect, authorize('admin'));

router.get('/', getAdminComments);                    // GET /api/admin/comments
router.put('/:id/status', updateCommentStatus);     // PUT /api/admin/comments/:id/status
router.delete('/:id', deleteAnyComment);           // DELETE /api/admin/comments/:id
router.post('/reply', replyToComment);             // POST /api/admin/comments/reply

module.exports = router;