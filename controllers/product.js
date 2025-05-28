const {
  getProducts,
  getProductById,
  insertProduct,
  updateProductById,
  deleteProductById,
} = require('../models/ProductModel.js');

// Validation des données du produit
const validateProduct = (data) => {
  const errors = [];
  
  if (!data.product_name || data.product_name.trim() === '') {
    errors.push('Product name is required');
  }
  
  if (data.product_price === undefined || data.product_price === null) {
    errors.push('Product price is required');
  } else if (isNaN(data.product_price) || data.product_price < 0) {
    errors.push('Product price must be a positive number');
  }
  
  return errors;
};

// Get all products
const showProducts = async (req, res) => {
  try {
    const results = await getProducts();
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get single product
const showProductById = async (req, res) => {
  try {
    const results = await getProductById(req.params.id);
    if (results) {
      res.json(results);
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create new product
const createProduct = async (req, res) => {
  try {
    const data = req.body;
    const errors = validateProduct(data);
    
    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }
    
    const results = await insertProduct(data);
    res.status(201).json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update product
const updateProduct = async (req, res) => {
  try {
    const data = req.body;
    const errors = validateProduct(data);
    
    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }
    
    const id = req.params.id;
    const results = await updateProductById(data, id);
    if (results) {
      res.json(results);
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete product
const deleteProduct = async (req, res) => {
  try {
    const id = req.params.id;
    const results = await deleteProductById(id);
    if (results.affectedRows > 0) {
      res.json(results);
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  showProducts,
  showProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
