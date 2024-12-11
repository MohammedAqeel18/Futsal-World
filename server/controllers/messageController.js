    const mongoose = require('mongoose');
    const Message = require('../models/Message');

    exports.sendMessage = async (req, res) => {
        console.log('Request body:', req.body);  // Log request body for debugging
    
        const { receiver, content, bookingId } = req.body;
        const sender = req.user && req.user.id;
    
        if (!sender) {
            return res.status(400).json({ message: 'Sender is required' });
        }
    
        if (!content || !bookingId) {
            return res.status(400).json({ message: 'Content and booking ID are required' });
        }
    
        console.log('Receiver:', receiver);  // Log receiver for debugging
    
        if (!receiver || !mongoose.Types.ObjectId.isValid(receiver)) {
            return res.status(400).json({ message: 'Receiver must be a valid user ID' });
        }
    
        try {
            const newMessage = new Message({
                sender,
                receiver,
                content,
                booking: bookingId
            });
    
            const savedMessage = await newMessage.save();
    
            if (savedMessage) {
                console.log('Message saved successfully:', savedMessage);  // Log success
                return res.status(201).json({ message: 'Message sent successfully', newMessage });
            } else {
                console.error('Message was not saved');  // Log failure
                return res.status(500).json({ message: 'Message could not be saved' });
            }
    
        } catch (error) {
            console.error('Error sending message:', error);
            return res.status(500).json({ message: 'Error sending message', error });
        }
    };
    

    exports.getInbox = async (req, res) => {
        const { bookingId } = req.query;
    
        if (!bookingId) {
            return res.status(400).json({ message: 'Booking ID is required' });
        }
    
        try {
            const messages = await Message.find({ booking: bookingId }).populate('sender', 'username');
            res.status(200).json(messages);
        } catch (error) {
            console.error('Error fetching messages:', error);
            res.status(500).json({ message: 'Error fetching messages', error });
        }
    };