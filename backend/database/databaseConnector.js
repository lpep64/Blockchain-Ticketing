import mysql from 'mysql2/promise';

const db = await mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root1*Password23',
  database: 'blockchainticketing' //locally supported as mysql is first installed on local device
});

// Export as db. use methods to call this
export default db;
