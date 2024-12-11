const express = require('express');
const router = express.Router();
const matchmakingMessageController = require('../controllers/matchmakingMessageController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/send', authMiddleware, matchmakingMessageController.sendMessage);
router.get('/inbox', authMiddleware, matchmakingMessageController.getInbox);

module.exports = router;
