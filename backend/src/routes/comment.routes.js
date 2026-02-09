const express = require('express');
const { protect } = require('../middleware/auth.middleware');
const {
  createComment,
  getArticleComments,
  likeComment,
  deleteComment
} = require('../controllers/comment.controller');

const router = express.Router();

// همه می‌تونن کامنت ببینن (بدون auth)
router.get('/article/:articleId', getArticleComments);

// کاربران لاگین شده می‌تونن کامنت بزنن
router.use(protect);

router.post('/', createComment);                    // POST /api/comments
router.post('/:commentId/like', likeComment);     // POST /api/comments/:id/like
router.delete('/:commentId', deleteComment);       // DELETE /api/comments/:id

module.exports = router;