// server/models/Match.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MatchSchema = new Schema({
    ground: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    timeSlot: {
        type: String,
        required: true
    },
    team1: {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        gender: {
            type: String,
            required: true
        }
    },
    team2: {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        gender: {
            type: String
        }
    }
});

module.exports = mongoose.model('Match', MatchSchema);
