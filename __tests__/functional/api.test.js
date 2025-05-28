const request = require('supertest');
const app = require('../../app');
const db = require('../../config/database');

describe('API Functional Tests', () => {
  const productIds = [];

  beforeAll(async () => {
    // Attendre que la base de données soit prête
    await new Promise(resolve => setTimeout(resolve, 5000));
  });

  afterAll(async () => {
    // Nettoyer tous les produits créés pendant les tests
    if (productIds.length > 0) {
      await db.query('DELETE FROM product WHERE product_id IN (?)', [productIds]);
    }
    await db.end();
  });

  test('GET /products should return all products', async () => {
    const response = await request(app)
      .get('/api/products')
      .expect('Content-Type', /json/)
      .expect(200);
    
    expect(Array.isArray(response.body)).toBeTruthy();
  });

  test('POST /products should create a new product', async () => {
    const newProduct = {
      product_name: 'New Test Product',
      product_price: 149.99
    };

    const response = await request(app)
      .post('/api/products')
      .send(newProduct)
      .expect('Content-Type', /json/)
      .expect(201);

    const productId = response.body.product_id;
    productIds.push(productId);

    expect(response.body).toHaveProperty('product_id');
    expect(response.body.product_name).toBe(newProduct.product_name);
    expect(response.body.product_price).toBe(newProduct.product_price);
  });

  test('GET /products/:id should return a single product', async () => {
    // Créer un produit pour le test
    const newProduct = {
      product_name: 'Test Product for GET',
      product_price: 99.99
    };

    const createResponse = await request(app)
      .post('/api/products')
      .send(newProduct)
      .expect(201);

    const productId = createResponse.body.product_id;
    productIds.push(productId);

    const response = await request(app)
      .get(`/api/products/${productId}`)
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body).toHaveProperty('product_id', productId);
    expect(response.body.product_name).toBe(newProduct.product_name);
    expect(response.body.product_price).toBe(newProduct.product_price);
  });

  test('PUT /products/:id should update a product', async () => {
    // Créer un produit pour le test
    const newProduct = {
      product_name: 'Test Product for PUT',
      product_price: 99.99
    };

    const createResponse = await request(app)
      .post('/api/products')
      .send(newProduct)
      .expect(201);

    const productId = createResponse.body.product_id;
    productIds.push(productId);

    const updateData = {
      product_name: 'Updated Product',
      product_price: 199.99
    };

    const response = await request(app)
      .put(`/api/products/${productId}`)
      .send(updateData)
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body.product_name).toBe(updateData.product_name);
    expect(response.body.product_price).toBe(updateData.product_price);
  });

  test('DELETE /products/:id should delete a product', async () => {
    // Créer un produit pour le test
    const newProduct = {
      product_name: 'Test Product for DELETE',
      product_price: 99.99
    };

    const createResponse = await request(app)
      .post('/api/products')
      .send(newProduct)
      .expect(201);

    const productId = createResponse.body.product_id;
    productIds.push(productId);

    await request(app)
      .delete(`/api/products/${productId}`)
      .expect(200);

    // Vérifier que le produit a été supprimé
    await request(app)
      .get(`/api/products/${productId}`)
      .expect(404);
  });
}); 