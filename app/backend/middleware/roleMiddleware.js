const { getHandlerResponse, httpStatus } = require('@adminsync/utils');
 
// Check if user has admin role
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role_id === 'admin') {
    next();
  } else {
    res.status(httpStatus.FORBIDDEN).json(
      getHandlerResponse('error', httpStatus.FORBIDDEN, 'Not authorized as an admin', null)
    );
  }
};
 
// Check if user has employee role
const isEmployee = (req, res, next) => {
  if (req.user && (req.user.role_id === 'employee' || req.user.role_id === 'admin')) {
    next();
  } else {
    res.status(httpStatus.FORBIDDEN).json(
      getHandlerResponse('error', httpStatus.FORBIDDEN, 'Not authorized as an employee', null)
    );
  }
};
 
// Check if user is accessing their own profile
const isSelf = (req, res, next) => {
  if (req.user && (req.user._id.toString() === req.params.id || req.user.role_id === 'admin')) {
    next();
  } else {
    res.status(httpStatus.FORBIDDEN).json(
      getHandlerResponse('error', httpStatus.FORBIDDEN, 'Not authorized to access this resource', null)
    );
  }
};
 
module.exports = { isAdmin, isEmployee, isSelf };