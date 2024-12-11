const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BookingTestSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    ground: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    timeSlot: {
        type: String,
        required: true
    },
    isPaid: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('BookingTest', BookingTestSchema);