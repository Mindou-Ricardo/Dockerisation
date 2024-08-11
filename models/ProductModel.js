const db = require('../config/db');

// Get all products
async function getProducts() {
  try {
    const [rows] = await db.query('SELECT * FROM product');
    return rows;
  } catch (err) {
    console.error('Error querying products', err);
    throw err;
  }
}

// Get product by ID
async function getProductById(id) {
  try {
    const [rows] = await db.query('SELECT * FROM product WHERE product_id = ?', [id]);
    return rows[0];
  } catch (err) {
    console.error('Error querying product by ID', err);
    throw err;
  }
}

// Insert a new product
async function insertProduct(data) {
  try {
    const [result] = await db.query('INSERT INTO product (product_name, product_price) VALUES (?, ?)', [data.product_name, data.product_price]);
    return result;
  } catch (err) {
    console.error('Error inserting product', err);
    throw err;
  }
}

// Update product by ID
async function updateProductById(data, id) {
  try {
    const [result] = await db.query('UPDATE product SET product_name = ?, product_price = ? WHERE product_id = ?', [data.product_name, data.product_price, id]);
    return result;
  } catch (err) {
    console.error('Error updating product', err);
    throw err;
  }
}

// Delete product by ID
async function deleteProductById(id) {
  try {
    const [result] = await db.query('DELETE FROM product WHERE product_id = ?', [id]);
    return result;
  } catch (err) {
    console.error('Error deleting product', err);
    throw err;
  }
}

module.exports = {
  getProducts,
  getProductById,
  insertProduct,
  updateProductById,
  deleteProductById,
};
