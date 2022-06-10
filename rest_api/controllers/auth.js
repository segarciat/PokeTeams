const path = require('path');
const fs = require('fs');
const request = require('request');
const crypto = require('crypto');
const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmails');
const asyncHandler = require('../utils/async');

// @desc    Register user
// @route   POST /api/v1/auth/register
// @access  Public
exports.register = asyncHandler(async (req, res, next) => {
  const { username, password, captcha } = req.body;
  const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.CAPTCHA_SECRET_KEY}&response=${captcha}`;
  request(verifyUrl, async (err, response, body) => {
    body = JSON.parse(body);
    if (!body.success) {
      return next(new ErrorResponse('Captcha did not pass.', 400));
    }
    try {
      const userExists = await User.exists({ username });
      if (userExists) {
        return next(new ErrorResponse(`User already exists.`, 400));
      }
      const user = await User.create({
        username,
        password,
      });
      await user.save();
      res.status(200).json({ success: true, data: 'User created.' });
      // captcha?
    } catch (err) {
      return next(new ErrorResponse(`User was not created.`, 500));
    }
  });
});

// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
exports.login = asyncHandler(async (req, res, next) => {
  const { username, password, captcha } = req.body;

  // Validate email and password.
  if (!username || !password) {
    return next(
      new ErrorResponse('Please provide a username and password', 400)
    );
  }
  const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.CAPTCHA_SECRET_KEY}&response=${captcha}`;

  request(verifyUrl, async (err, response, body) => {
    body = JSON.parse(body);

    if (!body.success) {
      return next(new ErrorResponse('Captcha did not pass.', 400));
    }

    // Check for user; explicitly requests password (defaults to not returning it).
    const user = await User.findOne({ username: username }).select('+password');

    if (!user) {
      return next(
        new ErrorResponse('The credentials provided were invalid.', 401)
      );
    }

    if (!user.active) {
      return next(new ErrorResponse('Inactive account.', 401));
    }

    // Check if password matches.
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return next(
        new ErrorResponse('The credentials provided were invalid.', 401)
      );
    }

    sendTokenResponse(user, 200, res);
  });
});

// @desc    Get current logged in user
// @route   POST /api/v1/auth/me
// @access  Private
exports.getMe = asyncHandler(async (req, res, next) => {
  res.status(200).json({
    success: true,
    data: req.user,
  });
});

// @desc    Log user out by clearing cookie
// @route   GET /api/v1/auth/logout
// @access  Private
exports.logout = asyncHandler(async (req, res, next) => {
  res.clearCookie('token');
  res.status(200).json({
    success: true,
    data: {},
  });
});

// @desc    Update user details
// @route   PUT /api/v1/auth/updatedetails
// @access  Private
exports.updateDetails = asyncHandler(async (req, res, next) => {
  const fieldsToUpdate = {
    username: req.body.username,
    // email: req.body.email,
  };
  const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: user,
  });
});

// @desc      Upload photo for user
// @route     PUT /api/v1/auth/photoupload
// @access    Private
exports.userPhotoUpload = asyncHandler(async (req, res, next) => {
  // Check if file has been uploaded.
  if (!req.files) {
    return next(new ErrorResponse(`Please upload a file.`, 400));
  }

  const file = req.files.file;

  // Image must be a photo.
  if (!file.mimetype.startsWith('image')) {
    return next(new ErrorResponse(`Please upload an image file.`, 400));
  }

  // 1 MB max for photo uploads.
  if (file.size > process.env.MAX_FILE_UPLOAD) {
    return next(
      new ErrorResponse(
        `Please upload an image less than ${
          process.env.MAX_FILE_UPLOAD / (1024 * 1024)
        } MB.`,
        400
      )
    );
  }

  // Create unique photo name; append timestamp to prevent caching issues.
  file.name = `photo_${req.user.id}${Date.now()}${path.parse(file.name).ext}`;

  const uploadsPath = path.join(
    process.env.PROJECT_DIR,
    process.env.PUBLIC_DIR,
    process.env.FILE_UPLOAD_DIR
  );
  // Delete old file.
  fs.readdirSync(uploadsPath)
    .filter((f) => f.startsWith(`photo_${req.user.id}`))
    .map((f) => fs.unlinkSync(path.join(uploadsPath, f)));

  // Move new file to photo folder.
  file.mv(path.join(uploadsPath, file.name), async (err) => {
    if (err) {
      return next(new ErrorResponse(`Unable to upload file`, 500));
    }

    await User.findByIdAndUpdate(
      req.user.id,
      { photo: file.name },
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({ success: true, photo: file.name });
  });
});

// Get token from model, create cookie, and send response.
const sendTokenResponse = (user, statusCode, res) => {
  const token = user.getSignedJwtToken();

  // Assumes days in JWT_COOKIE_EXPIRE.
  // httpOnly so cookie is accessed only in client side script.
  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
  };

  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({ success: true });
  // .json({ success: true, token });
};
