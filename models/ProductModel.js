const db = require('../config/db');

// Fonction utilitaire pour convertir les données du produit
const convertProductData = (product) => {
  if (!product) return null;
  return {
    ...product,
    price: parseFloat(product.price)
  };
};

// Get all products
async function getProducts() {
  try {
    const [rows] = await db.query('SELECT * FROM product');
    return rows.map(convertProductData);
  } catch (err) {
    process.stderr.write(`Error querying products: ${err.message}\n`);
    throw err;
  }
}

// Get product by ID
async function getProductById(id) {
  try {
    const [rows] = await db.query('SELECT * FROM product WHERE product_id = ?', [id]);
    return convertProductData(rows[0]);
  } catch (err) {
    process.stderr.write(`Error querying product by ID: ${err.message}\n`);
    throw err;
  }
}

// Insert a new product
async function insertProduct(data) {
  try {
    const [result] = await db.query('INSERT INTO product (name, price) VALUES (?, ?)', [data.name, data.price]);
    // Récupérer le produit créé
    const [rows] = await db.query('SELECT * FROM product WHERE product_id = ?', [result.insertId]);
    return convertProductData(rows[0]);
  } catch (err) {
    process.stderr.write(`Error inserting product: ${err.message}\n`);
    throw err;
  }
}

// Update product by ID
async function updateProductById(data, id) {
  try {
    // Vérifier d'abord si le produit existe
    const [rows] = await db.query('SELECT * FROM product WHERE product_id = ?', [id]);
    if (rows.length === 0) {
      return null;
    }

    // Mettre à jour le produit
    await db.query('UPDATE product SET name = ?, price = ? WHERE product_id = ?', 
      [data.name, data.price, id]);

    // Récupérer le produit mis à jour
    const [updatedRows] = await db.query('SELECT * FROM product WHERE product_id = ?', [id]);
    return convertProductData(updatedRows[0]);
  } catch (err) {
    process.stderr.write(`Error updating product: ${err.message}\n`);
    throw err;
  }
}

// Delete product by ID
async function deleteProductById(id) {
  try {
    const [result] = await db.query('DELETE FROM product WHERE product_id = ?', [id]);
    return result;
  } catch (err) {
    process.stderr.write(`Error deleting product: ${err.message}\n`);
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
