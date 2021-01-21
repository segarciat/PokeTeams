const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name.'],
  },
  email: {
    type: String,
    required: [true, 'Please add an email.'],
    unique: true,
    match: [
      /^\S+@\S+\.\S+$/,
      'Please verify the email is formatted correctly.',
    ],
  },
  password: {
    type: String,
    required: [true, 'Please add a password.'],
    minlength: 8,
    select: false,
  },
  resetPasswordToken: String,
  resetPasswordExpired: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Encrypt user's password with bcryptjs
UserSchema.pre('save', async function (next) {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

module.exports = mongoose.model('User', UserSchema);
