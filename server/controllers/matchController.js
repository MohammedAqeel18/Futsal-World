// matchController.js

const Match = require('../models/Match');
const nodemailer = require('nodemailer');
const QRCode = require('qrcode');
const stripe = require('stripe')('sk_test_51PPc3URrD4b010W800jFpYrGAjkdXurldHbVEs6kC6tAe4ascPwtwzjiXBhAo210X47DfIpVh75mqE7MXrIjGXH300hLF68cfz');

exports.createMatch = async (req, res) => {
    try {
        const { ground, date, timeSlot, gender } = req.body;
        const userId = req.user.id;

        const newMatch = new Match({
            ground,
            date,
            timeSlot,
            team1: {
                userId,
                gender
            }
        });

        await newMatch.save();
        res.json({ message: 'Match created successfully', match: newMatch });
    } catch (error) {
        res.status(500).json({ message: 'Error creating match', error });
    }
};

exports.joinMatch = async (req, res) => {
    try {
        const { matchId, gender } = req.body;
        const userId = req.user.id;

        const match = await Match.findById(matchId);

        if (!match) {
            return res.status(404).json({ message: 'Match not found' });
        }

        if (match.team2.userId) {
            return res.status(400).json({ message: 'Match is already full' });
        }

        match.team2 = {
            userId,
            gender
        };

        await match.save();

        // Send email to both teams
        const transporter = nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            auth: {
                user: 'velva95@ethereal.email',
                pass: 'VkD4HqYqKSJnsjnQS2'
            }
        });

        const mailOptions = {
            to: ['velva95@ethereal.email', 'velva95@ethereal.email'],
            from: 'matchmaking@futsalworld.com',
            subject: 'Match Confirmation',
            text: 'Both teams have joined. Please proceed with the payment.'
        };

        transporter.sendMail(mailOptions, (err, response) => {
            if (err) {
                return res.status(500).json({ message: 'Error sending email', error: err });
            }
            res.json({ message: 'Match joined successfully. Email sent to both teams.' });
        });
    } catch (error) {
        res.status(500).json({ message: 'Error joining match', error });
    }
};

exports.createPaymentIntent = async (req, res) => {
    try {
        const { amount } = req.body;

        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount * 100, // Stripe expects amount in cents
            currency: 'usd',
        });

        res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
        res.status(500).json({ message: 'Error creating payment intent', error });
    }
};

// exports.joinMatch = async (req, res) => {
//     try {
//         const { matchId } = req.body;
//         const userId = req.user.id;

//         const match = await Match.findById(matchId);
//         if (!match) {
//             return res.status(404).json({ message: 'Match not found' });
//         }

//         match.teamB = userId;
//         match.status = 'confirmed';

//         await match.save();

//         const userA = await User.findById(match.teamA);
//         const userB = await User.findById(match.teamB);

//         const transporter = nodemailer.createTransport({
//             host: 'smtp.ethereal.email',
//             port: 587,
//             auth: {
//                 user: 'velva95@ethereal.email',
//                 pass: 'VkD4HqYqKSJnsjnQS2'
//             },
//         });

//         const mailOptions = {
//             to: `${userA.email}, ${userB.email}`, // Include both users' emails
//             from: 'matchmaking@futsalworld.com',
//             subject: 'Match Confirmation',
//             text: `Your match is confirmed. Please proceed to the matchmaking page to complete the payment.`,
//         };

//         transporter.sendMail(mailOptions, (err, response) => {
//             if (err) {
//                 console.error('There was an error: ', err);
//                 return res.status(500).json({ message: 'Error sending email', error: err });
//             }

//             res.json({ message: 'Match joined and email sent', match });
//         });
//     } catch (err) {
//         res.status(500).json({ message: 'Error joining match', error: err });
//     }
// };

exports.getMatches = async (req, res) => {
    try {
        const matches = await Match.find();
        res.json(matches);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching matches', error });
    }
};

exports.sendQrCode = async (req, res) => {
    try {
        const { matchId } = req.body;

        const match = await Match.findById(matchId);
        if (!match) {
            return res.status(404).json({ message: 'Match not found' });
        }

        const qrData = {
            matchId: match._id,
            ground: match.ground,
            date: match.date,
            timeSlot: match.timeSlot
        };

        const qrCodeUrl = await QRCode.toDataURL(JSON.stringify(qrData));

        const user1 = await User.findById(match.team1.userId);
        const user2 = await User.findById(match.team2.userId);

        const transporter = nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            auth: {
                user: 'velva95@ethereal.email',
                pass: 'VkD4HqYqKSJnsjnQS2'
            }
        });

        const mailOptions1 = {
            to: 'velva95@ethereal.email',
            from: 'match@futsalworld.com',
            subject: 'Match QR Code',
            text: `Please find attached the QR code for your match.`,
            attachments: [
                {
                    filename: 'qrcode.png',
                    path: qrCodeUrl
                }
            ]
        };

        const mailOptions2 = {
            to: 'velva95@ethereal.email',
            from: 'match@futsalworld.com',
            subject: 'Match QR Code',
            text: `Please find attached the QR code for your match.`,
            attachments: [
                {
                    filename: 'qrcode.png',
                    path: qrCodeUrl
                }
            ]
        };

        await transporter.sendMail(mailOptions1);
        await transporter.sendMail(mailOptions2);

        res.json({ message: 'QR codes sent successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error sending QR codes', error: err });
    }
};