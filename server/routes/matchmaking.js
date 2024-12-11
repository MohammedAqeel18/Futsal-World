const express = require('express');
const router = express.Router();
const matchmakingController = require('../controllers/matchmakingController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/available-time-slots', authMiddleware, matchmakingController.getAvailableTimeSlots);
router.post('/create', authMiddleware, matchmakingController.createMatchmaking);

module.exports = router;
