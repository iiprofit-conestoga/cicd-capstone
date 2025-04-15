const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const { getHandlerResponse, httpStatus } = require('@adminsync/utils');
 
// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '7d', // Token expires in 7 days
  });
};
 
// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(httpStatus.BAD_REQUEST).json(
        getHandlerResponse('error', httpStatus.BAD_REQUEST, 'Please provide email and password', null)
      );
    }

    // Check for user email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(httpStatus.UNAUTHORIZED).json(
        getHandlerResponse('error', httpStatus.UNAUTHORIZED, 'Invalid credentials', null)
      );
    }

    // Check password
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(httpStatus.UNAUTHORIZED).json(
        getHandlerResponse('error', httpStatus.UNAUTHORIZED, 'Invalid credentials', null)
      );
    }

    // Generate token
    const token = generateToken(user._id);

    // Send response
    res.status(httpStatus.OK).json(
      getHandlerResponse('success', httpStatus.OK, 'Login successful', {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role_id: user.role_id,
          phoneNumber: user.phoneNumber,
        },
      })
    );
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json(
      getHandlerResponse('error', httpStatus.INTERNAL_SERVER_ERROR, error.message, null)
    );
  }
};
 
// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
const logout = async (req, res) => {
  try {
    // Since we're using JWT, we don't need to do anything server-side
    // The client will handle removing the token
    res.status(httpStatus.OK).json(
      getHandlerResponse('success', httpStatus.OK, 'Logged out successfully', null)
    );
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json(
      getHandlerResponse('error', httpStatus.INTERNAL_SERVER_ERROR, error.message, null)
    );
  }
};
 
// @desc    Get current user profile
// @route   GET /api/auth/profile
// @access  Private
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');

    res.status(httpStatus.OK).json(
      getHandlerResponse('success', httpStatus.OK, 'Profile retrieved successfully', user)
    );
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json(
      getHandlerResponse('error', httpStatus.INTERNAL_SERVER_ERROR, error.message, null)
    );
  }
};
 
// @desc    Change password for logged-in user
// @route   PUT /api/auth/change-password
// @access  Private
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);
 
    if (!user) {
      return res.status(httpStatus.NOT_FOUND).json(
        getHandlerResponse('error', httpStatus.NOT_FOUND, 'User not found', null)
      );
    }
 
    // Check current password
    if (!(await user.matchPassword(currentPassword))) {
      return res.status(httpStatus.UNAUTHORIZED).json(
        getHandlerResponse('error', httpStatus.UNAUTHORIZED, 'Current password is incorrect', null)
      );
    }
 
    // Update password
    user.password = newPassword;
    await user.save();
 
    res.status(httpStatus.OK).json(
      getHandlerResponse('success', httpStatus.OK, 'Password changed successfully', null)
    );
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json(
      getHandlerResponse('error', httpStatus.INTERNAL_SERVER_ERROR, error.message, null)
    );
  }
};
 
module.exports = {
  login,
  logout,
  getProfile,
  changePassword
};
 