const express = require("express");
const {
  showProducts,
  showProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/product.js");

const router = express.Router();

// Get all products
router.get("/products", showProducts);

// Get single product
router.get("/products/:id", showProductById);

// Create new product
router.post("/products", createProduct);

// Update product
router.put("/products/:id", updateProduct);

// Delete product
router.delete("/products/:id", deleteProduct);

module.exports = router;
