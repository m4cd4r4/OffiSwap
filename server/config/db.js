        const { Pool } = require('pg');
require('dotenv').config({ path: '../.env' }); // Ensure .env is loaded relative to this file's location

// Create a new connection pool using environment variables
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Test the connection
pool.connect((err, client, release) => {
  if (err) {
    return console.error('Error acquiring client', err.stack);
  }
  console.log('Connected to PostgreSQL database successfully!');
  client.release(); // Release the client back to the pool
});

// Export the pool for querying the database
module.exports = pool;
