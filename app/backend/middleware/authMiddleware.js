const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const { getHandlerResponse, httpStatus } = require('@adminsync/utils');
 
// Protect routes
const protect = async (req, res, next) => {
  let token;
 
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];
 
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
 
      // Get user from the token
      req.user = await User.findById(decoded.id).select('-password');
 
      next();
    } catch (error) {
      res.status(httpStatus.UNAUTHORIZED).json(
        getHandlerResponse('error', httpStatus.UNAUTHORIZED, 'Not authorized, token failed', null)
      );
    }
  }
 
  if (!token) {
    res.status(httpStatus.UNAUTHORIZED).json(
      getHandlerResponse('error', httpStatus.UNAUTHORIZED, 'Not authorized, no token', null)
    );
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