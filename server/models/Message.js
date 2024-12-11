const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true }, // Ensure this is set properly
    timestamp: { type: Date, default: Date.now },
    read: { type: Boolean, default: false },
    highlight: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.models.Message || mongoose.model('Message', messageSchema);
