const request = require('supertest');
const app = require('../../app');
const db = require('../../config/database');

describe('End-to-End Tests', () => {
  const productIds = [];

  beforeAll(async () => {
    // Attendre que la base de données soit prête
    await new Promise(resolve => setTimeout(resolve, 5000));
  });

  afterAll(async () => {
    // Nettoyer la base de données après les tests
    if (productIds.length > 0) {
      await db.query('DELETE FROM product WHERE product_id IN (?)', [productIds]);
    }
    await db.end();
  });

  test('Complete product flow', async () => {
    // 1. Créer un produit
    const newProduct = {
      product_name: 'Test Product E2E',
      product_price: 99.99
    };

    const createResponse = await request(app)
      .post('/api/products')
      .send(newProduct)
      .expect(201);

    const productId = createResponse.body.product_id;
    productIds.push(productId);
    expect(productId).toBeDefined();

    // 2. Vérifier que le produit a été créé
    const getResponse = await request(app)
      .get(`/api/products/${productId}`)
      .expect(200);

    expect(getResponse.body.product_name).toBe(newProduct.product_name);
    expect(getResponse.body.product_price).toBe(newProduct.product_price);

    // 3. Mettre à jour le produit
    const updateData = {
      product_name: 'Updated E2E Product',
      product_price: 149.99
    };

    // Vérifier que le produit existe avant la mise à jour
    await request(app)
      .get(`/api/products/${productId}`)
      .expect(200);

    const updateResponse = await request(app)
      .put(`/api/products/${productId}`)
      .send(updateData)
      .expect(200);

    expect(updateResponse.body.product_name).toBe(updateData.product_name);
    expect(updateResponse.body.product_price).toBe(updateData.product_price);

    // 4. Vérifier la liste des produits
    const listResponse = await request(app)
      .get('/api/products')
      .expect(200);

    expect(Array.isArray(listResponse.body)).toBeTruthy();
    expect(listResponse.body.some(p => p.product_id === productId)).toBeTruthy();

    // 5. Supprimer le produit
    await request(app)
      .delete(`/api/products/${productId}`)
      .expect(200);

    // 6. Vérifier que le produit a été supprimé
    await request(app)
      .get(`/api/products/${productId}`)
      .expect(404);
  });

  test('Error handling and edge cases', async () => {
    // 1. Tenter de créer un produit avec des données invalides
    const invalidProduct = {
      product_name: '',
      product_price: -10
    };

    const errorResponse = await request(app)
      .post('/api/products')
      .send(invalidProduct)
      .expect(400);

    expect(errorResponse.body.errors).toBeDefined();
    expect(errorResponse.body.errors.length).toBeGreaterThan(0);

    // 2. Tenter de récupérer un produit inexistant
    await request(app)
      .get('/api/products/999999')
      .expect(404);

    // 3. Tenter de mettre à jour un produit inexistant
    await request(app)
      .put('/api/products/999999')
      .send({ product_name: 'Test', product_price: 10 })
      .expect(404);

    // 4. Tenter de supprimer un produit inexistant
    await request(app)
      .delete('/api/products/999999')
      .expect(404);
  });
}); 