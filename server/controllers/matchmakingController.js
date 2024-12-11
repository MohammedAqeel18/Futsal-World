const QRCode = require('qrcode');
const Matchmaking = require('../models/Matchmaking');
const User = require('../models/User');
const { sendMatchmakingBookingConfirmationEmail } = require('./matchmakingMailService');

// Generate QR Code for a matchmaking booking
const generateQRCode = async (data) => {
    try {
        const qrCodeUrl = await QRCode.toDataURL(data, {
            errorCorrectionLevel: 'L',
            width: 128,
            margin: 0,
        });
        return qrCodeUrl;
    } catch (err) {
        console.error('Failed to generate QR Code:', err);
    }
};

// Fetch available slots for matchmaking
exports.getAvailableTimeSlots = async (req, res) => {
    const { ground, date } = req.query;
    try {
        const bookings = await Matchmaking.find({ ground, date }).populate('user1 user2', 'email');

        const bookedSlots = bookings.map((booking) => ({
            timeSlot: booking.timeSlot,
            user1: booking.user1 ? { id: booking.user1._id, email: booking.user1.email } : null,
            user2: booking.user2 ? { id: booking.user2._id, email: booking.user2.email } : null,
            bookingId: booking._id,
        }));

        const allTimeSlots = [];
        for (let hour = 11; hour < 24; hour++) {
            const startTime = `${hour.toString().padStart(2, '0')}:00`;
            const endTime = `${(hour + 1).toString().padStart(2, '0')}:00`;
            allTimeSlots.push(`${startTime} - ${endTime}`);
        }

        // Partially booked slots should still be considered available
        const availableTimeSlots = allTimeSlots.filter(slot => {
            const booking = bookedSlots.find(booked => booked.timeSlot === slot);
            return !booking || !booking.user1 || !booking.user2;  // Available if at least one sub-slot is free
        });

        res.json({ bookedSlots, availableTimeSlots });
    } catch (err) {
        res.status(500).json({ message: 'Error fetching available time slots', error: err });
    }
};


// Create a matchmaking booking
exports.createMatchmaking = async (req, res) => {
    const { ground, date, timeSlot, subSlot, amount } = req.body;
    const userId = req.user.id;

    try {
        let booking = await Matchmaking.findOne({ ground, date, timeSlot });

        if (!booking) {
            booking = new Matchmaking({
                ground,
                date,
                timeSlot,
                amount,
                user1: subSlot === 1 ? userId : null,
                user2: subSlot === 2 ? userId : null,
            });
        } else {
            if (subSlot === 1 && !booking.user1) {
                booking.user1 = userId;
            } else if (subSlot === 2 && !booking.user2) {
                booking.user2 = userId;
            } else {
                return res.status(400).json({ message: 'Time slot already booked' });
            }
        }

        const savedBooking = await booking.save();

        const user = await User.findById(userId);

        if (user && user.email) {
            await sendMatchmakingBookingConfirmationEmail(user.email, {
                bookingId: savedBooking._id,
                ground,
                date,
                timeSlot,
                subSlot,
                amount
            });
        }

        return res.status(201).json(savedBooking);
    } catch (err) {
        console.error('Error during booking creation:', err);
        return res.status(500).json({ message: 'Server error', error: err });
    }
};