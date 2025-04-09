const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const { getHandlerResponse, httpStatus } = require('@adminsync/utils');
 
// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};
 
// Generate Refresh Token
const generateRefreshToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
};
 
// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
 
    // Check for user email
    const user = await User.findOne({ email });
    console.log(user);
    if (user && (await user.matchPassword(password))) {
      // Update last login
      user.lastLogin = new Date();
      await user.save();
 
      // Generate tokens
      const accessToken = generateToken(user._id);
      const refreshToken = generateRefreshToken(user._id);
 
      // Save refresh token to user
      user.refreshToken = refreshToken;
      await user.save();
 
      res.status(httpStatus.OK).json(
        getHandlerResponse('success', httpStatus.OK, 'Login successful', {
          _id: user._id,
          name: user.name,
          email: user.email,
          role_id: user.role_id,
          accessToken,
          refreshToken
        })
      );
    } else {
      res.status(httpStatus.UNAUTHORIZED).json(
        getHandlerResponse('error', httpStatus.UNAUTHORIZED, 'Invalid email or password', null)
      );
    }
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json(
      getHandlerResponse('error', httpStatus.INTERNAL_SERVER_ERROR, error.message, null)
    );
  }
};
 
// @desc    Logout user / clear cookie
// @route   POST /api/auth/logout
// @access  Private
const logoutUser = async (req, res) => {
  try {
    const userId = req.user._id;
    
    // Clear refresh token
    const user = await User.findById(userId);
    if (user) {
      user.refreshToken = null;
      await user.save();
    }
 
    res.status(httpStatus.OK).json(
      getHandlerResponse('success', httpStatus.OK, 'Logged out successfully', null)
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
    const userId = req.user._id;
 
    // Validate input
    if (!currentPassword || !newPassword) {
      return res.status(httpStatus.BAD_REQUEST).json(
        getHandlerResponse('error', httpStatus.BAD_REQUEST, 'Current password and new password are required', null)
      );
    }
 
    // Validate new password
    if (newPassword.length < 6) {
      return res.status(httpStatus.BAD_REQUEST).json(
        getHandlerResponse('error', httpStatus.BAD_REQUEST, 'New password must be at least 6 characters long', null)
      );
    }
 
    // Find user
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(httpStatus.NOT_FOUND).json(
        getHandlerResponse('error', httpStatus.NOT_FOUND, 'User not found', null)
      );
    }
 
    // Check if current password is correct
    const isMatch = await user.matchPassword(currentPassword);
    
    if (!isMatch) {
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
 
// @desc    Refresh access token
// @route   POST /api/auth/refresh-token
// @access  Public
const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
 
    if (!refreshToken) {
      return res.status(httpStatus.BAD_REQUEST).json(
        getHandlerResponse('error', httpStatus.BAD_REQUEST, 'Refresh token is required', null)
      );
    }
 
    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
    
    // Find user with this refresh token
    const user = await User.findById(decoded.id);
    
    if (!user || user.refreshToken !== refreshToken) {
      return res.status(httpStatus.UNAUTHORIZED).json(
        getHandlerResponse('error', httpStatus.UNAUTHORIZED, 'Invalid refresh token', null)
      );
    }
 
    // Generate new access token
    const accessToken = generateToken(user._id);
 
    res.status(httpStatus.OK).json(
      getHandlerResponse('success', httpStatus.OK, 'Token refreshed successfully', {
        accessToken
      })
    );
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json(
      getHandlerResponse('error', httpStatus.INTERNAL_SERVER_ERROR, error.message, null)
    );
  }
};
 
// @desc    Forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
 
    // Find user by email
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(httpStatus.NOT_FOUND).json(
        getHandlerResponse('error', httpStatus.NOT_FOUND, 'User not found', null)
      );
    }
 
    // Generate reset token
    const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });
 
    // Save reset token to user
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();
 
    // In a real application, you would send this token via email
    // For now, we'll just return it in the response
    res.status(httpStatus.OK).json(
      getHandlerResponse('success', httpStatus.OK, 'Password reset token generated', {
        resetToken
      })
    );
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json(
      getHandlerResponse('error', httpStatus.INTERNAL_SERVER_ERROR, error.message, null)
    );
  }
};
 

 
module.exports = {
  loginUser,
  logoutUser,
  changePassword,
  refreshToken,
  forgotPassword
};
 