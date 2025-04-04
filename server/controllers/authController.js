const pool = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); // Import jsonwebtoken
require('dotenv').config({ path: '../.env' }); // Ensure .env is loaded

// User Registration (Signup)
const registerUser = async (req, res) => {
  const { name, email, password, location } = req.body;

  // Basic validation
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email, and password are required.' });
  }

  try {
    // Check if user already exists
    const userExists = await pool.query('SELECT * FROM Users WHERE email = $1', [email]);
    if (userExists.rows.length > 0) {
      return res.status(409).json({ message: 'User with this email already exists.' });
    }

    // Hash the password
    const saltRounds = 10; // Recommended salt rounds
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insert new user into the database
    const newUser = await pool.query(
      'INSERT INTO Users (name, email, password_hash, location) VALUES ($1, $2, $3, $4) RETURNING id, name, email, location, created_at',
      [name, email, hashedPassword, location] // Use location if provided, otherwise it will be NULL
    );

    // Respond with the created user data (excluding password)
    res.status(201).json(newUser.rows[0]);

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration.' });
  }
};

// User Login
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  // Basic validation
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  try {
    // Find user by email
    const userResult = await pool.query('SELECT * FROM Users WHERE email = $1', [email]);
    const user = userResult.rows[0];

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials.' }); // User not found
    }

    // Compare provided password with stored hash
    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials.' }); // Password doesn't match
    }

    // Passwords match, create JWT payload
    const payload = {
      user: {
        id: user.id,
        email: user.email,
        name: user.name
        // Add other relevant non-sensitive user info if needed
      }
    };

    // Sign the token
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1h' }, // Token expires in 1 hour (adjust as needed)
      (err, token) => {
        if (err) throw err;
        // Send token back to client
        res.json({ token });
      }
    );

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login.' });
  }
};


module.exports = {
  registerUser,
  loginUser,
};
