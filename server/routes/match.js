const express = require('express');
const router = express.Router();
const { createMatch, joinMatch, createPaymentIntent, getMatches, sendQrCode } = require('../controllers/matchController');
const authMiddleware = require('../middleware/authMiddleware');

const matchController = require('../controllers/matchController');

router.post('/', authMiddleware, createMatch);
router.post('/join', authMiddleware, joinMatch);
router.post('/create-payment-intent', authMiddleware, createPaymentIntent);
router.get('/', authMiddleware, getMatches); 
router.post('/send-qr-code', authMiddleware, sendQrCode);

module.exports = router;
