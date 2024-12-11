const mongoose = require('mongoose');
const Schema = mongoose.Schema;  // Extract the Schema from mongoose

const BookingSchema = new Schema({
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
    },
    status: {
        type: String,
        default: 'pending', // New field to track booking status
    },
    amount: { 
        type: Number, 
        required: true 
    },
    isConfirmed: { 
        type: Boolean, 
        default: false 
    }
});

module.exports = mongoose.model('Booking', BookingSchema);
