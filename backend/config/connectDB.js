const mysql = require('mysql2');

// Create connection pool
const pool = mysql.createPool({
  host: 'localhost',  // Change if using a remote database
  user: 'root',
  password: 'root1*Password23',
  database: 'blockchain_ticketing',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Promisify for async/await usage
const db = pool.promise();

module.exports = db;