const stripe = require('stripe')('sk_test_51PPc3URrD4b010W800jFpYrGAjkdXurldHbVEs6kC6tAe4ascPwtwzjiXBhAo210X47DfIpVh75mqE7MXrIjGXH300hLF68cfz');

const nodemailer = require('nodemailer');
const QRCode = require('qrcode');
const User = require('../models/User');
const { sendBookingConfirmationEmail } = require('./mailService');
const Booking = require('../models/Booking');

const generateQRCode = async (data) => {
    try {
        const qrCodeUrl = await QRCode.toDataURL(data, {
            errorCorrectionLevel: 'L',
            width: 128,
            margin: 0
        });
        console.log('QR Code generated successfully');
        return qrCodeUrl;
    } catch (err) {
        console.error('Failed to generate QR Code:', err);
    }
};



exports.cancelBooking = async (req, res) => {
    const bookingId = req.params.id;
    const userId = req.user.id;

    try {
        const booking = await Booking.findById(bookingId);
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        if (booking.user.toString() !== userId) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        const bookingDate = new Date(booking.date);
        const currentDate = new Date();
        const deadlineDate = new Date(bookingDate.setDate(bookingDate.getDate() - 1));

        if (currentDate > deadlineDate) {
            return res.status(400).json({ message: 'Cannot cancel booking. The deadline has passed.' });
        }

        await Booking.findByIdAndDelete(bookingId);
        res.json({ message: 'Booking cancelled successfully' });
    } catch (err) {
        console.error('Error cancelling booking:', err);
        res.status(500).json({ message: 'Error cancelling booking', error: err });
    }
};



// Update in `getAvailableSlots` function
exports.getAvailableTimeSlots = async (req, res) => {
    const { ground, date } = req.query;
    try {
        const bookings = await Booking.find({ ground, date }).populate('user', 'email');
        
        const bookedSlots = bookings.map(booking => ({
            timeSlot: booking.timeSlot,
            userId: booking.user._id,
            userEmail: booking.user.email,
            bookingId: booking._id  // Ensure bookingId is included here
        }));

        const allTimeSlots = [];
        for (let hour = 11; hour < 24; hour++) {
            const startTime = `${hour.toString().padStart(2, '0')}:00`;
            const endTime = `${(hour + 1).toString().padStart(2, '0')}:00`;
            allTimeSlots.push(`${startTime} - ${endTime}`);
        }

        const availableTimeSlots = allTimeSlots.filter(slot => !bookedSlots.find(booked => booked.timeSlot === slot));

        res.json({ bookedSlots, availableTimeSlots });
    } catch (err) {
        res.status(500).json({ message: 'Error fetching available time slots', error: err });
    }
};
exports.confirmBooking = async (req, res) => {
    const { bookingId } = req.body;

    try {
        const booking = await Booking.findById(bookingId);
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        booking.isConfirmed = true; // Example field to mark the booking as confirmed
        await booking.save();

        res.json({ message: 'Booking confirmed successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error confirming booking', error });
    }
};
exports.confirmBookingByQR = async (req, res) => {
    const { bookingId } = req.body;

    if (!bookingId) {
        return res.status(400).json({ message: 'Booking ID is required' });
    }

    try {
        const booking = await Booking.findById(bookingId);
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        booking.isConfirmed = true; // Example field to mark the booking as confirmed
        await booking.save();

        res.json({ message: 'Booking confirmed successfully', booking });
    } catch (error) {
        console.error('Error confirming booking:', error);
        res.status(500).json({ message: 'Error confirming booking', error });
    }
};
exports.createBooking = async (req, res) => {
    const { ground, date, timeSlot, amount } = req.body;
    console.log('Received user from authMiddleware:', req.user);  // Debug user

    const userId = req.user.id;

    if (!userId) {
        return res.status(400).json({ message: 'User ID is required' });
    }

    try {
        const newBooking = new Booking({
            user: userId,
            ground,
            date,
            timeSlot,
            amount
        });

        const savedBooking = await newBooking.save();

        if (savedBooking) {
            console.log('Booking saved successfully:', savedBooking);  // Log success
            const qrCodeData = `bookingId:${savedBooking._id}`;
            const qrCodeUrl = await generateQRCode(qrCodeData);

            const user = await User.findById(userId);
            if (user && user.email) {
                sendBookingConfirmationEmail(user.email, {
                    bookingId: savedBooking._id,
                    ground,
                    date,
                    timeSlot,
                    amount,
                    qrCodeUrl
                });
            }

            return res.status(201).json(savedBooking);
        } else {
            console.error('Booking was not saved');  // Log failure
            return res.status(500).json({ message: 'Booking could not be saved' });
        }

    } catch (err) {
        console.error('Error during booking creation:', err);
        return res.status(500).json({ message: 'Server error', error: err });
    }
};
