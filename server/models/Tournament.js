const mongoose = require('mongoose');

const TournamentSchema = new mongoose.Schema({
    teamName: {
        type: String,
        required: true,
    },
    coachName: {
        type: String,
        required: true,
    },
    members: {
        type: String,
        required: true,
    },
    sport: {
        type: String,
        required: true,
    },
    tournamentDate: {  // Add tournament date to schema
        type: Date,
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Tournament', TournamentSchema);
