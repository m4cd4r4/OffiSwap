const express = require('express');
const { registerUser, loginUser } = require('../controllers/authController'); // Import controller functions

const router = express.Router();

// Define routes
router.post('/register', registerUser); // Route for user registration
router.post('/login', loginUser);       // Route for user login

module.exports = router; // Export the router
