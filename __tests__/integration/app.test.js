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
    if (productIds.length > 0) {
      await db.query('DELETE FROM product WHERE product_id IN (?)', [productIds]);
    }
    await db.end();
  });

  test('Complete product lifecycle', async () => {
    // 1. Créer un produit
    const newProduct = {
      product_name: 'Test Product Integration',
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
      product_name: 'Updated Integration Product',
      product_price: 149.99
    };

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

  test('Database connection and structure', async () => {
    // Vérifier la connexion à la base de données
    const [tables] = await db.query('SHOW TABLES');
    console.log('Tables found:', tables);
    expect(tables.length).toBeGreaterThan(0);

    // Vérifier la structure de la table product
    const [columns] = await db.query('SHOW COLUMNS FROM product');
    console.log('Columns found:', columns);
    expect(columns.length).toBeGreaterThan(0);

    // Vérifier les colonnes spécifiques
    const expectedColumns = ['product_id', 'product_name', 'product_price'];
    columns.forEach(column => {
      console.log('Checking column', column.Field + ':', column);
      expect(expectedColumns).toContain(column.Field);
    });
  });
}); 