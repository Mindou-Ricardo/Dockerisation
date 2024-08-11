/* const mysql = require("mysql2");

// Create the connection to the database
const db = mysql.createConnection({
  //host: process.env.DB_HOST || `localhost`,
  host: process.env.DB_HOST || `db`,
  user: process.env.DB_USER || `root`,
  password: process.env.DB_PASSWORD || ``,
  database: process.env.DB_NAME || `pos_db`,
});

db.connect((err) => {
  if (err) {
    console.log("Error connecting to database", err);
    // Handle the error appropriately
  } else {
    console.log("Connected to database");
  }
});

module.exports = db; 
 */
const mysql = require('mysql2/promise');

// Create the connection to the database using promises
const db = mysql.createPool({
  host: process.env.DB_HOST || 'db',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'pos_db',
  waitForConnections: true,
  connectionLimit: 10,  // Configure as needed
  queueLimit: 0
});

module.exports = db;


