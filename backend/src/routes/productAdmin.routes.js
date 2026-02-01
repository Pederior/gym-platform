const express = require('express');
const router = express.Router();
const productController = require('../controllers/productAdmin.controller');
const { protect, admin } = require('../middleware/auth.middleware');
// Apply admin middleware to all routes
router.use(protect);
router.use(admin);

// Routes
router
  .route('/')
  .get(productController.getProducts)
  .post(
    productController.upload.single('image'),
    productController.createProduct
  );

router
  .route('/:id')
  .get(productController.getProductById)
  .put(
    productController.upload.single('image'),
    productController.updateProduct
  )
  .delete(productController.deleteProduct);

router.patch('/:id/status', productController.toggleStatus);

module.exports = router;