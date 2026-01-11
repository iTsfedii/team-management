const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  try {
    // Get token from headers
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({
        message: 'No token provided - please login first'
      });
    }

    // Verify token is real
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Save user ID for later use
    req.userId = decoded.userId;

    // Continue to next route
    next();
  } catch (error) {
    res.status(401).json({
      message: 'Invalid or expired token',
      error: error.message
    });
  }
};

module.exports = authMiddleware;
