const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');


router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/recover', authController.recover);
router.post('/reset/:token', authController.resetPassword); 
router.get('/profile', authMiddleware, authController.getProfile);
router.post('/check-email', authController.checkEmail); // Make sure this route points to the correct controller

module.exports = router;
