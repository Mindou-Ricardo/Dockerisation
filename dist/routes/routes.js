"use strict";

var express = require('express');
var _require = require('../controllers/product.js'),
  showProducts = _require.showProducts,
  showProductById = _require.showProductById,
  createProduct = _require.createProduct,
  updateProduct = _require.updateProduct,
  deleteProduct = _require.deleteProduct;
var router = express.Router();

// Get all products
router.get('/products', showProducts);

// Get single product
router.get('/products/:id', showProductById);

// Create new product
router.post('/products', createProduct);

// Update product
router.put('/products/:id', updateProduct);

// Delete product
router["delete"]('/products/:id', deleteProduct);
module.exports = router;