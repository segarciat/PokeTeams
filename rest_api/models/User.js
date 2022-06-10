const crypto = require('crypto');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Please add a username.'],
    unique: true,
    match: [
      /^([a-zA-Z0-9_.-]+)$/,
      'Please verify the email is formatted correctly.',
    ],
    minlength: 8,
    maxlength: 32,
  },
  password: {
    type: String,
    required: [true, 'Please add a password.'],
    minlength: 8,
    select: false,
  },
  active: {
    type: Boolean,
    default: true,
  },
  role: {
    type: String,
    default: 'user',
  },
  photo: {
    type: String,
    default: 'no-photo.png',
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Encrypt user's password with bcryptjs.
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Cascade delete teams when a user is deleted.
UserSchema.pre(
  /^(delete|remove)/,
  { document: true, query: false },
  async function (next) {
    await this.model('Team').deleteMany({ user: this._id });
    next();
  }
);

// Sign JWT and return.
UserSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// Match user entered password to hashed password in database.
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate and hash password token.
UserSchema.methods.getResetPasswordToken = function () {
  // Generate the token.
  const resetToken = crypto.randomBytes(20).toString('hex');

  // Hash token and set to resetPasswordToken field.
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // Set the expire field. (10 minutes).

  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
  // Unhashed token sent back to client.
  return resetToken;
};

module.exports = mongoose.model('User', UserSchema);
