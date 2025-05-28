const { getProducts, getProductById, insertProduct, updateProductById, deleteProductById } = require('../../models/ProductModel');

// Mock de la base de données
jest.mock('../../config/db', () => ({
  query: jest.fn()
}));

describe('Product Model Unit Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('getProducts should return all products', async () => {
    const mockProducts = [
      { product_id: 1, product_name: 'Test Product 1', product_price: 10.99 },
      { product_id: 2, product_name: 'Test Product 2', product_price: 20.99 }
    ];
    
    require('../../config/db').query.mockResolvedValue([mockProducts]);
    
    const result = await getProducts();
    expect(result).toEqual(mockProducts);
  });

  test('getProductById should return a single product', async () => {
    const mockProduct = { product_id: 1, product_name: 'Test Product', product_price: 10.99 };
    require('../../config/db').query.mockResolvedValue([[mockProduct]]);
    
    const result = await getProductById(1);
    expect(result).toEqual(mockProduct);
  });

  test('insertProduct should create a new product', async () => {
    const newProduct = {
      product_name: 'New Product',
      product_price: 15.99
    };
    
    const mockInsertResult = { insertId: 1 };
    const mockProduct = { product_id: 1, ...newProduct };
    
    const db = require('../../config/db');
    db.query
      .mockResolvedValueOnce([mockInsertResult]) // Premier appel pour l'insertion
      .mockResolvedValueOnce([[mockProduct]]); // Deuxième appel pour récupérer le produit
    
    const result = await insertProduct(newProduct);
    expect(result).toEqual(mockProduct);
  });

  test('updateProductById should update a product', async () => {
    const updateData = {
      product_name: 'Updated Product',
      product_price: 25.99
    };
    
    const existingProduct = { product_id: 1, product_name: 'Old Product', product_price: 15.99 };
    const updatedProduct = { product_id: 1, ...updateData };
    
    const db = require('../../config/db');
    db.query
      .mockResolvedValueOnce([[existingProduct]]) // Premier appel pour vérifier l'existence
      .mockResolvedValueOnce([{ affectedRows: 1 }]) // Deuxième appel pour la mise à jour
      .mockResolvedValueOnce([[updatedProduct]]); // Troisième appel pour récupérer le produit mis à jour
    
    const result = await updateProductById(updateData, 1);
    expect(result).toEqual(updatedProduct);
  });

  test('deleteProductById should delete a product', async () => {
    const mockResult = { affectedRows: 1 };
    require('../../config/db').query.mockResolvedValue([mockResult]);
    
    const result = await deleteProductById(1);
    expect(result).toEqual(mockResult);
  });
}); 