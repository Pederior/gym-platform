const express = require('express');
const { getPublicArticles, getPublicArticleById } = require('../controllers/article.controller');

const router = express.Router();

router.get('/public', getPublicArticles);           // GET /api/articles/public
router.get('/:id', getPublicArticleById);      // GET /api/articles/:id

module.exports = router;