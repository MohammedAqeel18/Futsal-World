const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Booking = require('../models/Booking');
const keys = require('../config/keys');

// Admin Login
exports.adminLogin = async (req, res) => {
    const { username, password } = req.body;

    if (username === keys.adminUsername && password === keys.adminPassword) {
        const token = jwt.sign({ id: 'admin' }, keys.secretOrKey, { expiresIn: 3600 });
        res.json({ token });
    } else {
        res.status(401).json({ message: 'Invalid credentials' });
    }
};

// Get Reservations
exports.getReservations = async (req, res) => {
    try {
        const reservations = await Booking.find();
        res.json(reservations);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching reservations', error: err });
    }
};

// Cancel Reservation
exports.cancelReservation = async (req, res) => {
    try {
        await Booking.findByIdAndDelete(req.params.id);
        res.json({ message: 'Reservation cancelled successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error cancelling reservation', error: err });
    }
};

// Update Knockout Table
exports.updateKnockoutTable = async (req, res) => {
    const { knockoutTable } = req.body;

    // Update logic for knockout table (store in DB or other persistence layer)
    res.json({ message: 'Knockout table updated successfully' });
};

// Get Users
exports.getUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching users', error: err });
    }
};

// Remove User
exports.removeUser = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: 'User removed successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error removing user', error: err });
    }
};
