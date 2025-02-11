import mysql from 'mysql2';

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root1*Password23',
  database: 'blockchain_ticketing'
});

const testDBConnection = async () => {
  try {
    console.log('Attempting to connect to database...');

    // Test connection
    await new Promise((resolve, reject) => {
      connection.connect((err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    console.log('Successfully connected to database!');

    // Corrected query
    const query = `
      INSERT INTO students (
        netid, 
        full_name, 
        peoplesoft_id, 
        uconn_email, 
        student_status, 
        claimed_tickets
      ) VALUES (?, ?, ?, ?, ?, ?)
    `;

    const values = [
      'test123',
      'Test Student',
      12345678, // Now an integer, not a string
      'test.student@uconn.edu',
      'active', // Using correct ENUM value
      JSON.stringify([]) // Proper JSON format
    ];

    // Execute query
    await new Promise((resolve, reject) => {
      connection.query(query, values, (error, results) => {
        if (error) reject(error);
        else {
          console.log('Test student added successfully!');
          console.log('Results:', results);
          resolve(results);
        }
      });
    });

  } catch (error) {
    console.error('Test failed:', error);
  } finally {
    connection.end();
  }
};

// Run the test
testDBConnection();