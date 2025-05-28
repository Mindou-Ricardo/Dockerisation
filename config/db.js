const mysql = require('mysql2/promise');

// Configuration de la base de données
const dbConfig = {
  host: process.env.DB_HOST || 'db',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'pos_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Création du pool de connexion
const db = mysql.createPool(dbConfig);

// Test de la connexion au démarrage
db.getConnection()
  .then(connection => {
    console.log('✅ Connexion à la base de données établie avec succès');
    connection.release();
  })
  .catch(err => {
    console.error('❌ Erreur de connexion à la base de données:', err.message);
    process.exit(1);
  });

// Gestion des erreurs du pool
db.on('error', (err) => {
  console.error('❌ Erreur inattendue du pool de connexion:', err.message);
  if (err.code === 'PROTOCOL_CONNECTION_LOST') {
    console.error('La connexion à la base de données a été perdue');
  } else if (err.code === 'ER_CON_COUNT_ERROR') {
    console.error('Trop de connexions à la base de données');
  } else if (err.code === 'ECONNREFUSED') {
    console.error('Connexion à la base de données refusée');
  }
});

module.exports = db;


