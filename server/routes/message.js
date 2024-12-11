const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const authMiddleware = require('../middleware/authMiddleware');

// Route for sending a message
router.post('/send', authMiddleware, messageController.sendMessage);

// Route for fetching inbox messages
router.get('/inbox', authMiddleware, messageController.getInbox);

module.exports = router;
