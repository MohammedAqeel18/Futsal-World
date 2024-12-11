const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const User = require('../models/User');
const keys = require('../config/keys');
const Booking = require('../models/Booking');

exports.register = (req, res) => {
    const { firstName, lastName, email, password, gender, contactNumber } = req.body;

    User.findOne({ email }).then(user => {
        if (user) {
            return res.status(400).json({ message: 'Email already exists' });
        } else {
            // Check if password length is at least 8 characters
            if (password.length < 8) {
                return res.status(400).json({ message: 'Password must be at least 8 characters long' });
            }

            const newUser = new User({ firstName, lastName, email, password, gender, contactNumber });

            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if (err) throw err;
                    newUser.password = hash;
                    newUser.save().then(user => res.json(user)).catch(err => console.log(err));
                });
            });
        }
    });
};

exports.login = (req, res) => {
    const { email, password } = req.body;

    User.findOne({ email }).then(user => {
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        bcrypt.compare(password, user.password).then(isMatch => {
            if (isMatch) {
                const payload = { id: user.id };

                jwt.sign(payload, keys.secretOrKey, { expiresIn: 3600 }, (err, token) => {
                    if (err) throw err;
                    res.json({ success: true, token: 'Bearer ' + token });
                });
            } else {
                return res.status(400).json({ message: 'Password incorrect' });
            }
        });
    });
};

exports.checkEmail = (req, res) => {
    const { email } = req.body;
    User.findOne({ email }).then(user => {
        if (user) {
            return res.json({ exists: true });
        }
        return res.json({ exists: false });
    }).catch(err => res.status(500).json({ message: 'Server error', error: err }));
};

exports.recover = (req, res) => {
    const { email } = req.body;
    User.findOne({ email }).then(user => {
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const token = crypto.randomBytes(20).toString('hex');

        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

        user.save().then(user => {
            const transporter = nodemailer.createTransport({
                host: 'smtp.ethereal.email',
                port: 587,
                auth: {
                    user: 'velva95@ethereal.email',
                    pass: 'VkD4HqYqKSJnsjnQS2'
                }
            });

            const mailOptions = {
                to: user.email,
                from: 'samorks@gmail.com',
                subject: 'Password Reset',
                text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
                Please click on the following link, or paste this into your browser to complete the process:\n\n
                http://${req.headers.host}/password-reset.html?token=${token}\n\n
                If you did not request this, please ignore this email and your password will remain unchanged.\n`,
            };

            transporter.sendMail(mailOptions, (err, response) => {
                if (err) {
                    console.error('There was an error: ', err);
                } else {
                    res.status(200).json('Recovery email sent.');
                }
            });
        });
    });
};

exports.resetPassword = (req, res) => {
    User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } })
        .then(user => {
            if (!user) {
                return res.status(400).json({ message: 'Password reset token is invalid or has expired.' });
            }

            // Update the password
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(req.body.password, salt, (err, hash) => {
                    if (err) throw err;
                    user.password = hash;
                    user.resetPasswordToken = undefined;
                    user.resetPasswordExpires = undefined;

                    user.save().then(updatedUser => res.json({ message: 'Password has been updated.' }));
                });
            });
        })
        .catch(err => res.status(500).json({ message: 'Server error', error: err }));
};

exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        const bookings = await Booking.find({ user: req.user.id });
        res.json({ user, bookings });
    } catch (err) {
        res.status(500).json({ message: 'Error fetching profile', error: err });
    }
};
