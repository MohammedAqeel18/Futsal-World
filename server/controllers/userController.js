const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Booking = require('../models/Booking');

exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const bookings = await Booking.find({ user: req.user.id });
        res.json({ user, bookings });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err });
    }
};

exports.updateProfile = (req, res) => {
    const { firstName, lastName, gender } = req.body;

    User.findById(req.user.id)
        .then(user => {
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            user.firstName = firstName || user.firstName;
            user.lastName = lastName || user.lastName;
            user.gender = gender || user.gender;

            user.save()
                .then(updatedUser => res.json(updatedUser))
                .catch(err => res.status(500).json({ message: 'Server error', error: err }));
        })
        .catch(err => res.status(500).json({ message: 'Server error', error: err }));
};

exports.changePassword = (req, res) => {
    const { currentPassword, newPassword } = req.body;

    User.findById(req.user.id)
        .then(user => {
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            bcrypt.compare(currentPassword, user.password).then(isMatch => {
                if (!isMatch) {
                    return res.status(400).json({ message: 'Current password incorrect' });
                }

                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newPassword, salt, (err, hash) => {
                        if (err) throw err;
                        user.password = hash;
                        user.save()
                            .then(updatedUser => res.json({ message: 'Password updated successfully' }))
                            .catch(err => res.status(500).json({ message: 'Server error', error: err }));
                    });
                });
            });
        })
        .catch(err => res.status(500).json({ message: 'Server error', error: err }));
};

exports.getPreviousBookings = (req, res) => {
    Booking.find({ user: req.user.id })
        .then(bookings => res.json(bookings))
        .catch(err => res.status(500).json({ message: 'Server error', error: err }));
};

exports.uploadProfileImage = async (req, res) => {
    try {
        const userId = req.user.id;
        const profileImage = req.file.path;

        const user = await User.findByIdAndUpdate(userId, { profileImage }, { new: true });
        res.json({ message: 'Profile image uploaded successfully', profileImage: user.profileImage });
    } catch (error) {
        res.status(500).json({ message: 'Failed to upload profile image', error });
    }
};
