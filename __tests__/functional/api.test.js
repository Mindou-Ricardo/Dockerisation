const request = require('supertest');
const app = require('../../app');
const db = require('../../config/database');

describe('API Functional Tests', () => {
  const productIds = [];

  beforeAll(async () => {
    // Attendre que la base de données soit prête
    await new Promise(resolve => setTimeout(resolve, 1000));
  });

  afterAll(async () => {
    // Nettoyer la base de données après les tests
    for (const id of productIds) {
      await db.query('DELETE FROM product WHERE product_id = ?', [id]);
    }
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
      name: 'Test Product',
      price: 99.99
    };

    const response = await request(app)
      .post('/api/products')
      .send(newProduct)
      .expect('Content-Type', /json/)
      .expect(201);

    const productId = response.body.product_id;
    productIds.push(productId);

    expect(response.body).toHaveProperty('product_id');
    expect(response.body.name).toBe(newProduct.name);
    expect(response.body.price).toBe(newProduct.price);
  });

  test('GET /products/:id should return a single product', async () => {
    // D'abord créer un produit
    const newProduct = {
      name: 'Test Product for GET',
      price: 88.88
    };

    const createResponse = await request(app)
      .post('/api/products')
      .send(newProduct)
      .expect('Content-Type', /json/)
      .expect(201);

    const productId = createResponse.body.product_id;
    productIds.push(productId);

    // Ensuite récupérer le produit
    const response = await request(app)
      .get(`/api/products/${productId}`)
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body).toHaveProperty('product_id', productId);
    expect(response.body.name).toBe(newProduct.name);
    expect(response.body.price).toBe(newProduct.price);
  });

  test('PUT /products/:id should update a product', async () => {
    // D'abord créer un produit
    const newProduct = {
      name: 'Test Product for PUT',
      price: 77.77
    };

    const createResponse = await request(app)
      .post('/api/products')
      .send(newProduct)
      .expect('Content-Type', /json/)
      .expect(201);

    const productId = createResponse.body.product_id;
    productIds.push(productId);

    // Ensuite mettre à jour le produit
    const updatedProduct = {
      name: 'Updated Product',
      price: 66.66
    };

    const response = await request(app)
      .put(`/api/products/${productId}`)
      .send(updatedProduct)
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body).toHaveProperty('product_id', productId);
    expect(response.body.name).toBe(updatedProduct.name);
    expect(response.body.price).toBe(updatedProduct.price);
  });

  test('DELETE /products/:id should delete a product', async () => {
    // D'abord créer un produit
    const newProduct = {
      name: 'Test Product for DELETE',
      price: 55.55
    };

    const createResponse = await request(app)
      .post('/api/products')
      .send(newProduct)
      .expect('Content-Type', /json/)
      .expect(201);

    const productId = createResponse.body.product_id;
    productIds.push(productId);

    // Ensuite supprimer le produit
    await request(app)
      .delete(`/api/products/${productId}`)
      .expect(204);

    // Vérifier que le produit a été supprimé
    await request(app)
      .get(`/api/products/${productId}`)
      .expect(404);
  });
}); 