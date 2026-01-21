const jwt = require('jsonwebtoken');
const User = require('../models/User');

// ⭐ VALIDATION MIDDLEWARE - Check if input data is valid
const validateInput = (requiredFields) => {
  return (req, res, next) => {
    // Check if all required fields exist
    for (let field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).json({ 
          message: `Missing required field: ${field}` 
        });
      }
    }
    next();
  };
};

// ⭐ AUTHENTICATION MIDDLEWARE - Check if user is logged in
const verifyToken = async (req, res, next) => {
  try {
    // Get token from Authorization header
    const token = req. headers.authorization?.split(' ')[1];
    // Format: "Bearer TOKEN_HERE"

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    // Verify token is valid
    const decoded = jwt. verify(token, process.env. JWT_SECRET);
    
    // Get user from database
    const user = await User.findById(decoded. userId);
    
    if (!user) {
      return res. status(401).json({ message: 'User not found' });
    }

    // Attach user to request so route can use it
    req.user = user;
    next();

  } catch (error) {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};

// ⭐ AUTHORIZATION MIDDLEWARE - Check if user has the right role
const authorize = (allowedRoles) => {
  return (req, res, next) => {
    // Check if user's role is in the allowed list
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: `Access denied. Required role: ${allowedRoles.join(' or ')}` 
      });
    }
    next();
  };
};

module.exports = {
  verifyToken,
  authorize,
  validateInput
};
