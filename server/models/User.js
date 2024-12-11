const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    gender: { type: String },
    role: { type: String, default: 'user' }, // 'user' or 'admin'
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
    date: { type: Date, default: Date.now },
    profileImage: { type: String } ,
    contactNumber: { type: String, required: true }, // Add contact number field
});

module.exports = mongoose.model('User', UserSchema);
