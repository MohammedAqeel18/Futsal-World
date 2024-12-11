const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MatchmakingSchema = new Schema({
    ground: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    timeSlot: {
        type: String,
        required: true,
    },
    user1: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        default: null,
    },
    user2: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        default: null,
    },
    amount: {
        type: Number,
        required: true,
    },
});

module.exports = mongoose.model('Matchmaking', MatchmakingSchema);
