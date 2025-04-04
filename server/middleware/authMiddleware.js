const jwt = require('jsonwebtoken');
require('dotenv').config({ path: '../.env' }); // Ensure .env is loaded

const authMiddleware = (req, res, next) => {
  // Get token from header
  const token = req.header('x-auth-token'); // Common practice to use 'x-auth-token' header

  // Check if no token
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied.' });
  }

  // Verify token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Add user from payload to request object
    req.user = decoded.user; // Contains { id, email, name } from the payload
    next(); // Call the next middleware or route handler
  } catch (err) {
    console.error('Token verification failed:', err.message);
    res.status(401).json({ message: 'Token is not valid.' });
  }
};

module.exports = authMiddleware;
