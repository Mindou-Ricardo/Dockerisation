const {
  getProducts,
  getProductById,
  insertProduct,
  updateProductById,
  deleteProductById,
} = require("../models/ProductModel.js");

// Get all products
const showProducts = async (req, res) => {
  try {
    const results = await getProducts();
    res.json(results);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// Get single product
const showProductById = async (req, res) => {
  try {
    const results = await getProductById(req.params.id);
    if (results) {
      res.json(results);
    } else {
      res.status(404).send('Product not found');
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// Create new product
const createProduct = async (req, res) => {
  try {
    const data = req.body;
    const results = await insertProduct(data);
    res.status(201).json(results);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// Update product
const updateProduct = async (req, res) => {
  try {
    const data = req.body;
    const id = req.params.id;
    const results = await updateProductById(data, id);
    if (results.affectedRows > 0) {
      res.json(results);
    } else {
      res.status(404).send('Product not found');
    }
  } catch (err) {
    res.status(500).send(err.message);
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
      res.status(404).send('Product not found');
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
};

module.exports = {
  showProducts,
  showProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
