const express = require('express');
const router = express.Router();
const { searchProducts } = require('../controllers/productController');

// @route   GET /api/products/search
// @desc    Search for products and compare them
// @access  Public
router.get('/search', searchProducts);

module.exports = router;