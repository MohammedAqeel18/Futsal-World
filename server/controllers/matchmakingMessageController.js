const mongoose = require('mongoose');
const MatchmakingMessage = require('../models/MatchmakingMessage');

// Function to send a message between users
exports.sendMessage = async (req, res) => {
    const { receiver, content, bookingId } = req.body;
    const sender = req.user.id;

    // Basic validation
    if (!sender || !content || !bookingId) {
        return res.status(400).json({ message: 'Sender, content, and booking ID are required' });
    }

    try {
        // Create a new message document
        const newMessage = new MatchmakingMessage({
            sender,
            receiver,
            content,
            booking: bookingId,
        });

        // Save the message in the database
        const savedMessage = await newMessage.save();
        res.status(201).json({ message: 'Message sent successfully', newMessage: savedMessage });
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({ message: 'Error sending message', error });
    }
};

// Function to fetch messages for a specific booking
exports.getInbox = async (req, res) => {
    const { bookingId } = req.query;

    if (!bookingId) {
        return res.status(400).json({ message: 'Booking ID is required' });
    }

    try {
        // Fetch messages for this booking
        const messages = await MatchmakingMessage.find({ booking: bookingId })
            .populate('sender', 'username')  // Display the sender's username
            .sort({ timestamp: 1 }); // Sort messages chronologically

        res.status(200).json(messages);
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ message: 'Error fetching messages', error });
    }
};
