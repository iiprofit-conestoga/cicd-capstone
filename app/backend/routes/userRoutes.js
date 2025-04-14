const express = require('express');
const router = express.Router();
const { 
  addUser, 
  getUserProfile, 
  updateUserProfile, 
  deleteUser,
  getAllUsers,
  editUser
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const { isAdmin, isEmployee, isSelf } = require('../middleware/roleMiddleware');

// User routes
// Admin only routes
// This is the route for the admin to add a new user
router.post('/add', protect, isAdmin, addUser);
// This is the route for the admin to get all users
router.get('/all', protect, isAdmin, getAllUsers);
// This is the route for the admin to edit a user
router.put('/:id', protect, isAdmin, editUser);
// This is the route for the admin to delete a user
router.delete('/:id', protect, isAdmin, deleteUser);

// Employee routes (including admin)  
// This is the route for the employee to get their own profile
router.get('/profile/:id', protect, isSelf, getUserProfile);
// This is the route for the employee to update their own profile
router.put('/profile/:id', protect, isSelf, updateUserProfile);

// Current user profile route
router.get('/profile', protect, (req, res) => {
  res.status(200).json({
    status: 'success',
    data: req.user
  });
});

module.exports = router; 