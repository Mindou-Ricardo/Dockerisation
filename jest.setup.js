// Configuration globale pour les tests
process.env.NODE_ENV = 'test';
process.env.DB_HOST = 'localhost';
process.env.DB_USER = 'root';
process.env.DB_PASSWORD = 'test';
process.env.DB_NAME = 'pos_db';

// Augmenter le timeout des tests
jest.setTimeout(30000); 