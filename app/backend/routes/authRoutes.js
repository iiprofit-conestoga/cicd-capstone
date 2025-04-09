const express = require('express');
const router = express.Router();
const {
  loginUser,
  logoutUser,
  changePassword,
  refreshToken,
  forgotPassword,

} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { isEmployee } = require('../middleware/roleMiddleware');
 
// Public routes
router.post('/login', loginUser);
router.post('/forgot-password', forgotPassword);
router.post('/refresh-token', refreshToken);
 
// Employee routes (including admin)
router.post('/logout', protect, isEmployee, logoutUser);
router.put('/change-password', protect, isEmployee, changePassword);
 
module.exports = router;
 