// routes/adminArticle.routes.js
const express = require('express');
const { protect } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/role.middleware');
const {
  getAdminArticles,
  getAdminArticleById,
  createArticle,
  updateAnyArticle,
  deleteAnyArticle
} = require('../controllers/adminArticle.controller');

const router = express.Router();

router.use(protect, authorize('admin'));

router.get('/', getAdminArticles);           // GET /api/admin/articles
router.get('/:id', getAdminArticleById);
router.post('/', createArticle);            // GET /api/admin/articles/:id
router.put('/:id', updateAnyArticle);       // PUT /api/admin/articles/:id
router.delete('/:id', deleteAnyArticle);    // DELETE /api/admin/articles/:id

module.exports = router;