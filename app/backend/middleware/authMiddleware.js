const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const { getHandlerResponse, httpStatus } = require('@adminsync/utils');
 
// Protect routes
const protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        status: 'error',
        message: 'Not authorized, no token',
      });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from token
      const user = await User.findById(decoded.id).select('-password');
      
      if (!user) {
        return res.status(401).json({
          status: 'error',
          message: 'Not authorized, user not found',
        });
      }

      // Add user to request object
      req.user = user;
      next();
    } catch (error) {
      return res.status(401).json({
        status: 'error',
        message: 'Not authorized, token failed',
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Server error',
    });
  }
};
 
// Admin middleware
const admin = (req, res, next) => {
  if (req.user && req.user.role_id === 'admin') {
    next();
  } else {
    res.status(httpStatus.FORBIDDEN).json(
      getHandlerResponse('error', httpStatus.FORBIDDEN, 'Not authorized as an admin', null)
    );
  }
};
 
module.exports = { protect, admin };