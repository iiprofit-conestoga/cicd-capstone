const express = require('express');
const router = express.Router();
const {
  login,
  logout,
  getProfile,
  changePassword
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { isEmployee } = require('../middleware/roleMiddleware');
 
// Public routes
router.post('/login', login);
 
// Protected routes
router.get('/profile', protect, getProfile);
router.post('/logout', protect, logout);
router.put('/change-password', protect, changePassword);
 
module.exports = router;
 