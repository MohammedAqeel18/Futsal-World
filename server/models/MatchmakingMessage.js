const mongoose = require('mongoose');

const matchmakingMessageSchema = new mongoose.Schema({
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Matchmaking', required: true },
    timestamp: { type: Date, default: Date.now },
    read: { type: Boolean, default: false },
    highlight: { type: Boolean, default: false },
});

module.exports = mongoose.model('MatchmakingMessage', matchmakingMessageSchema);
