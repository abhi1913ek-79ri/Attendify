const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ['admin', 'student'],
    default: 'student',
  },
   isVerified: { type: Boolean, default: false },
  otp: String,
  otpExpires: Date
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
