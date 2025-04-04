// Load environment variables from .env file
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes'); // Import auth routes
const listingRoutes = require('./routes/listingRoutes'); // Import listing routes

// Initialize Express app
const app = express();

// Middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded request bodies

// Basic route for testing
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to OffiSwap API!' });
});

// API Routes
app.use('/api/auth', authRoutes); // Use auth routes for /api/auth path
app.use('/api/listings', listingRoutes); // Use listing routes for /api/listings path
// TODO: Add routes for claims, etc.

// Define the port
const PORT = process.env.PORT || 5001; // Use port from .env or default to 5001

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

module.exports = app; // Export app for potential testing
