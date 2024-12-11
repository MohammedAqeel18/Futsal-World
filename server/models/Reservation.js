const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReservationSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    ground: {
        type: String,
        required: true,
    },
    date: {
        type: String,
        required: true,
    },
    timeSlot: {
        type: String,
        required: true,
    },
    isPaid: {
        type: Boolean,
        required: true,
    },
});

module.exports = mongoose.model('Reservation', ReservationSchema);
