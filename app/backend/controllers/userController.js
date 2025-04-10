const User = require('../models/userModel');
const { getHandlerResponse, httpStatus } = require('@adminsync/utils');

// @desc    Add a new user
// @route   POST /api/users/add
// @access  Admin
const addUser = async (req, res) => {
  try {
    const { name, email, password, dateOfBirth, phoneNumber, address, role_id } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(httpStatus.BAD_REQUEST).json(
        getHandlerResponse('error', httpStatus.BAD_REQUEST, 'User already exists', null)
      );
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      dateOfBirth,
      phoneNumber,
      address,
      role_id: role_id || 'employee' // Default to employee if not specified
    });

    if (user) {
      res.status(httpStatus.CREATED).json(
        getHandlerResponse('success', httpStatus.CREATED, 'User added successfully', {
          _id: user._id,
          name: user.name,
          email: user.email,
          role_id: user.role_id
        })
      );
    }
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json(
      getHandlerResponse('error', httpStatus.INTERNAL_SERVER_ERROR, error.message, null)
    );
  }
};

// @desc    Get all users
// @route   GET /api/users/all
// @access  Admin
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password -refreshToken -resetPasswordToken -resetPasswordExpires');
    
    res.status(httpStatus.OK).json(
      getHandlerResponse('success', httpStatus.OK, 'Users retrieved successfully', users)
    );
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json(
      getHandlerResponse('error', httpStatus.INTERNAL_SERVER_ERROR, error.message, null)
    );
  }
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password -refreshToken -resetPasswordToken -resetPasswordExpires');
    
    if (user) {
      res.status(httpStatus.OK).json(
        getHandlerResponse('success', httpStatus.OK, 'User profile retrieved successfully', user)
      );
    } else {
      res.status(httpStatus.NOT_FOUND).json(
        getHandlerResponse('error', httpStatus.NOT_FOUND, 'User not found', null)
      );
    }
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json(
      getHandlerResponse('error', httpStatus.INTERNAL_SERVER_ERROR, error.message, null)
    );
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.dateOfBirth = req.body.dateOfBirth || user.dateOfBirth;
      user.phoneNumber = req.body.phoneNumber || user.phoneNumber;
      user.address = req.body.address || user.address;
      
      // Only admin can change role
      if (req.user.role_id === 'admin' && req.body.role_id) {
        user.role_id = req.body.role_id;
      }
      
      if (req.body.password) {
        user.password = req.body.password;
      }
      
      const updatedUser = await user.save();
      
      res.status(httpStatus.OK).json(
        getHandlerResponse('success', httpStatus.OK, 'User updated successfully', {
          _id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
          role_id: updatedUser.role_id
        })
      );
    } else {
      res.status(httpStatus.NOT_FOUND).json(
        getHandlerResponse('error', httpStatus.NOT_FOUND, 'User not found', null)
      );
    }
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json(
      getHandlerResponse('error', httpStatus.INTERNAL_SERVER_ERROR, error.message, null)
    );
  }
};

// @desc    Edit user (admin only)
// @route   PUT /api/users/:id
// @access  Admin
const editUser = async (req, res) => {
  try {
    const { name, email, dateOfBirth, phoneNumber, address, role_id, password } = req.body;
    
    // Find user
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(httpStatus.NOT_FOUND).json(
        getHandlerResponse('error', httpStatus.NOT_FOUND, 'User not found', null)
      );
    }
    
    // Check if email is being changed and if it already exists
    if (email && email !== user.email) {
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        return res.status(httpStatus.BAD_REQUEST).json(
          getHandlerResponse('error', httpStatus.BAD_REQUEST, 'Email already exists', null)
        );
      }
      user.email = email;
    }
    
    // Update user fields
    if (name) user.name = name;
    if (dateOfBirth) user.dateOfBirth = dateOfBirth;
    if (phoneNumber) user.phoneNumber = phoneNumber;
    if (address) user.address = address;
    if (role_id) user.role_id = role_id;
    if (password) user.password = password;
    
    // Save updated user
    const updatedUser = await user.save();
    
    res.status(httpStatus.OK).json(
      getHandlerResponse('success', httpStatus.OK, 'User edited successfully', {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role_id: updatedUser.role_id,
        dateOfBirth: updatedUser.dateOfBirth,
        phoneNumber: updatedUser.phoneNumber,
        address: updatedUser.address
      })
    );
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json(
      getHandlerResponse('error', httpStatus.INTERNAL_SERVER_ERROR, error.message, null)
    );
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Admin
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (user) {
      await User.deleteOne({ _id: user._id });
      
      res.status(httpStatus.OK).json(
        getHandlerResponse('success', httpStatus.OK, 'User removed successfully', null)
      );
    } else {
      res.status(httpStatus.NOT_FOUND).json(
        getHandlerResponse('error', httpStatus.NOT_FOUND, 'User not found', null)
      );
    }
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json(
      getHandlerResponse('error', httpStatus.INTERNAL_SERVER_ERROR, error.message, null)
    );
  }
};

module.exports = {
  addUser,
  getAllUsers,
  getUserProfile,
  updateUserProfile,
  editUser,
  deleteUser
}; 