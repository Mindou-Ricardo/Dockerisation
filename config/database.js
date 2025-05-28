const mysql = require('mysql2/promise');
const fs = require('fs').promises;
const path = require('path');

const config = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'test',
  database: process.env.DB_NAME || 'pos_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

const pool = mysql.createPool(config);

// Fonction pour exécuter la migration
async function runMigration() {
  try {
    const migrationPath = path.join(__dirname, '..', 'migrations', 'create_product_table.sql');
    const migrationSQL = await fs.readFile(migrationPath, 'utf8');
    await pool.query(migrationSQL);
    console.log('Migration executed successfully');
  } catch (error) {
    console.error('Error executing migration:', error);
    throw error;
  }
}

// Exécuter la migration au démarrage
runMigration().catch(console.error);

// Test de la connexion
pool.getConnection()
  .then(connection => {
    console.log('Database connection established successfully');
    connection.release();
  })
  .catch(err => {
    console.error('Error connecting to the database:', err);
  });

module.exports = pool; 