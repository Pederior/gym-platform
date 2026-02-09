const express = require('express');
const { protect } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/role.middleware');
const {
  getCoachArticles,
  createArticle,
  getCoachArticleById,
  updateArticle,
  deleteArticle
} = require('../controllers/article.controller');

const router = express.Router();

router.use(protect, authorize('coach'));

router.get('/', getCoachArticles);           // GET /api/coach/articles
router.post('/', createArticle);            // POST /api/coach/articles
router.get('/:id', getCoachArticleById);   // GET /api/coach/articles/:id
router.put('/:id', updateArticle);         // PUT /api/coach/articles/:id
router.delete('/:id', deleteArticle);      // DELETE /api/coach/articles/:id

module.exports = router;