const ProductModel = require('../models/ProductModel');

// Validation des données du produit
const validateProduct = (product) => {
  if (!product.name || !product.price) {
    throw new Error('Name and price are required');
  }
  if (typeof product.price !== 'number' || product.price <= 0) {
    throw new Error('Price must be a positive number');
  }
};

// Get all products
const showProducts = async (req, res) => {
  try {
    const products = await ProductModel.getProducts();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get single product
const showProductById = async (req, res) => {
  try {
    const product = await ProductModel.getProductById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create new product
const createProduct = async (req, res) => {
  try {
    validateProduct(req.body);
    const product = await ProductModel.insertProduct(req.body);
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update product
const updateProduct = async (req, res) => {
  try {
    validateProduct(req.body);
    const product = await ProductModel.updateProductById(req.params.id, req.body);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete product
const deleteProduct = async (req, res) => {
  try {
    const result = await ProductModel.deleteProductById(req.params.id);
    if (!result) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  showProducts,
  showProductById,
  createProduct,
  updateProduct,
  deleteProduct
};
