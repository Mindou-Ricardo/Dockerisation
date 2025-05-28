const request = require('supertest');
const app = require('../../app');
const db = require('../../config/database');

describe('Integration Tests', () => {
  const productIds = [];

  beforeAll(async () => {
    // Attendre que la base de données soit prête
    await new Promise(resolve => setTimeout(resolve, 5000));
  });

  afterAll(async () => {
    // Nettoyer la base de données après les tests
    for (const id of productIds) {
      await db.query('DELETE FROM product WHERE product_id = ?', [id]);
    }
    await db.end();
  });

  test('Complete product lifecycle', async () => {
    // 1. Créer un produit
    const newProduct = {
      name: 'Test Product',
      price: 99.99
    };

    const createResponse = await request(app)
      .post('/api/products')
      .send(newProduct)
      .expect('Content-Type', /json/)
      .expect(201);

    const productId = createResponse.body.product_id;
    productIds.push(productId);

    expect(createResponse.body).toHaveProperty('product_id');
    expect(createResponse.body.name).toBe(newProduct.name);
    expect(createResponse.body.price).toBe(newProduct.price);

    // 2. Récupérer le produit
    const getResponse = await request(app)
      .get(`/api/products/${productId}`)
      .expect('Content-Type', /json/)
      .expect(200);

    expect(getResponse.body).toHaveProperty('product_id', productId);
    expect(getResponse.body.name).toBe(newProduct.name);
    expect(getResponse.body.price).toBe(newProduct.price);

    // 3. Mettre à jour le produit
    const updatedProduct = {
      name: 'Updated Product',
      price: 149.99
    };

    const updateResponse = await request(app)
      .put(`/api/products/${productId}`)
      .send(updatedProduct)
      .expect('Content-Type', /json/)
      .expect(200);

    expect(updateResponse.body).toHaveProperty('product_id', productId);
    expect(updateResponse.body.name).toBe(updatedProduct.name);
    expect(updateResponse.body.price).toBe(updatedProduct.price);

    // 4. Vérifier la mise à jour
    const verifyResponse = await request(app)
      .get(`/api/products/${productId}`)
      .expect('Content-Type', /json/)
      .expect(200);

    expect(verifyResponse.body).toHaveProperty('product_id', productId);
    expect(verifyResponse.body.name).toBe(updatedProduct.name);
    expect(verifyResponse.body.price).toBe(updatedProduct.price);

    // 5. Supprimer le produit
    await request(app)
      .delete(`/api/products/${productId}`)
      .expect(204);

    // 6. Vérifier la suppression
    await request(app)
      .get(`/api/products/${productId}`)
      .expect(404);
  });

  test('Database connection and structure', async () => {
    // Vérifier la connexion à la base de données
    const [tables] = await db.query('SHOW TABLES');
    console.log('Tables found:', tables);
    expect(tables.length).toBeGreaterThan(0);

    // Vérifier la structure de la table product
    const [columns] = await db.query('SHOW COLUMNS FROM product');
    console.log('Columns found:', columns);

    const expectedColumns = ['product_id', 'name', 'price', 'created_at', 'updated_at'];
    console.log('Received array:', expectedColumns);
    
    columns.forEach(column => {
      console.log('Checking column', column.Field + ':', column);
      expect(expectedColumns).toContain(column.Field);
    });
  });
}); 