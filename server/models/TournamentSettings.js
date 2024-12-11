const mongoose = require('mongoose');

const TournamentSettingsSchema = new mongoose.Schema({
    footballRegistrationOpen: { type: Boolean, default: false },
    cricketRegistrationOpen: { type: Boolean, default: false },
    footballTournamentDate: { type: String, required: false },
    footballDeadline: { type: String, required: false },
    cricketTournamentDate: { type: String, required: false },
    cricketDeadline: { type: String, required: false },
    isRegistrationClosed: { type: Boolean, default: false },  // New field to track registration status
    isBracketVisible: { type: Boolean, default: false },  // New field to control bracket visibility
});

module.exports = mongoose.model('TournamentSettings', TournamentSettingsSchema);
