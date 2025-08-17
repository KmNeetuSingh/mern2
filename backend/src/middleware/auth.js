const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    // Get token from cookie
    const token = req.cookies.token;

    if (!token) {
      console.log('Auth middleware: No token found in cookies.');
      return res.status(401).json({ message: 'Authentication required' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Auth middleware: Token verified, decoded:', decoded);

    // Find user
    const user = await User.findById(decoded.userId);

    if (!user) {
      console.log('Auth middleware: User not found for decoded token ID:', decoded.userId);
      return res.status(401).json({ message: 'User not found' });
    }

    // Explicit check: If user is still somehow null/undefined here, stop.
    if (!user || !user._id) {
       console.error('Auth middleware: User object is invalid after lookup.', user);
       return res.status(500).json({ message: 'Internal authentication error' });
    }

    // Add user to request
    req.user = user;
    console.log('Auth middleware: User authenticated and attached to request:', req.user._id);
    next();
  } catch (error) {
    console.error('Auth middleware error:', error.name, error.message);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' });
    }
    // Catch any other potential errors during user lookup or processing
    res.status(500).json({ message: 'Server error during authentication' });
  }
};

module.exports = auth; 