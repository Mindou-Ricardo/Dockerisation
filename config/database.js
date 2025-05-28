const mysql = require('mysql2/promise');
const fs = require('fs').promises;
const path = require('path');

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'product_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

const runMigration = async () => {
  let connection;
  try {
    connection = await pool.getConnection();
    console.log('Connected to database');

    const migrationPath = path.join(__dirname, '..', 'migrations', 'create_product_table.sql');
    const migrationSQL = await fs.readFile(migrationPath, 'utf8');
    
    const queries = migrationSQL.split(';').filter(query => query.trim());
    
    for (const query of queries) {
      if (query.trim()) {
        await connection.query(query);
      }
    }
    
    console.log('Migration completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  } finally {
    if (connection) {
      connection.release();
    }
  }
};

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

module.exports = {
  pool,
  runMigration
}; 