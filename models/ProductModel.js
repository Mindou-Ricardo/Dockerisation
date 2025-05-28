const { pool } = require('../config/database');

// Fonction utilitaire pour convertir les données du produit
const convertProductData = (product) => {
  if (!product) return null;
  return {
    ...product,
    price: parseFloat(product.price)
  };
};

// Get all products
const getProducts = async () => {
  const [rows] = await pool.query('SELECT * FROM product');
  return rows.map(row => ({
    ...row,
    price: Number(row.price)
  }));
};

// Get product by ID
const getProductById = async (id) => {
  const [rows] = await pool.query('SELECT * FROM product WHERE product_id = ?', [id]);
  if (rows.length === 0) return null;
  return {
    ...rows[0],
    price: Number(rows[0].price)
  };
};

// Insert a new product
const insertProduct = async (product) => {
  const [result] = await pool.query(
    'INSERT INTO product (name, price) VALUES (?, ?)',
    [product.name, product.price]
  );
  return getProductById(result.insertId);
};

// Update product by ID
const updateProductById = async (id, product) => {
  const [result] = await pool.query(
    'UPDATE product SET name = ?, price = ? WHERE product_id = ?',
    [product.name, product.price, id]
  );
  if (result.affectedRows === 0) return null;
  return getProductById(id);
};

// Delete product by ID
const deleteProductById = async (id) => {
  const [result] = await pool.query('DELETE FROM product WHERE product_id = ?', [id]);
  return result.affectedRows > 0;
};

module.exports = {
  getProducts,
  getProductById,
  insertProduct,
  updateProductById,
  deleteProductById,
};
