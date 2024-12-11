const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const authMiddleware = require('../middleware/authMiddleware');

// Use bookingController directly to avoid issues with destructuring
router.post('/book', authMiddleware, bookingController.createBooking);
router.get('/available-time-slots', authMiddleware, bookingController.getAvailableTimeSlots);
//router.get('/available-slots', bookingController.getAvailableSlots);  // Adjusted to use bookingController directly
router.post('/confirm', bookingController.confirmBooking);  // Adjusted to use bookingController directly
router.post('/confirm-booking-by-qr', bookingController.confirmBookingByQR);

module.exports = router;
