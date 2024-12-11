const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/create-payment-intent', authMiddleware, bookingController.createPaymentIntent);
router.post('/', authMiddleware, bookingController.createBooking);
router.delete('/:id', authMiddleware, bookingController.cancelBooking);
router.post('/confirm', authMiddleware, bookingController.confirmBooking);

// New endpoint to fetch available time slots
router.get('/available-time-slots', authMiddleware, bookingController.getAvailableTimeSlots);

module.exports = router;