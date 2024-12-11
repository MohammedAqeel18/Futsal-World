const mongoose = require('mongoose');

const BracketSchema = new mongoose.Schema({
    sport: {
        type: String,
        required: true,
    },
    structure: {
        type: Array,
        required: true, // An array of rounds and matches
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Bracket', BracketSchema);
