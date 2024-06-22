const jwt = require('jsonwebtoken');
const { promisify } = require('util');

// models
const User = require('../models/userModel');

// utils
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

// signing jwt token with user id
const signInToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// method for signing token and sending token affter
const signAndSendToken = (user, statusCode, res) => {
  const token = signInToken(user._id);
  res.status(statusCode).json({
    status: 'Success',
    token,
    userId: user._id,
  });
};

// method to decode jwt token
exports.verifyToken = async (token) => {
  const decodedToken = await promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET
  );
  return decodedToken;
};

// method to find users by jwt when using stomp events
exports.findUserByToken = async (jwt) => {
  const decodedToken = await this.verifyToken(jwt);
  const user = await User.findById(decodedToken.id);

  if (!user) throw new AppError('Invalid token received!', 401);
  return user;
};

// method for registering user
exports.signUp = catchAsync(async (req, res, next) => {
  const { email, password, passwordConfirm, name, lastName } = req?.body;

  // checking for all fields so we dont run unnecessary queries to database
  if (!email || password !== passwordConfirm || !name || !lastName) {
    return next(new AppError('All fields are requireD!', 400));
  }

  // creating user
  const newUser = await User.create({
    email,
    password,
    passwordConfirm,
    name,
    lastName,
    role: 'user',
  });

  // checking for created user
  if (!newUser) {
    return next(new AppError('Fail to register! Please try again', 400));
  }

  // sending jwt token with created status
  signAndSendToken(newUser, 201, res);
});

// method for login user
exports.signIn = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password)
    return next(new AppError('All fields are required', 400));

  const user = await User.findOne({
    email: email,
  }).select('+password');

  if (user && !user.isActive) {
    await User.findByIdAndUpdate(
      user._id,
      { isActive: true },
      { new: true, runValidators: false }
    );
  }

  if (user && user.isBanned) return next(new AppError('You have been banned!'));

  if (!user || !user.checkUserPassword(password, user.password))
    return next(new AppError('Invalid username or password', 400));

  signAndSendToken(user, 200, res);
});

// method for restring routes only to logged users
exports.protect = catchAsync(async (req, res, next) => {
  const token = req.headers?.authorization?.split('Bearer ')[1];
  if (!token) {
    return next(new AppError('Invalid token received!', 401));
  }

  const decodedToken = await this.verifyToken(token);

  const user = await User.findById(decodedToken.id);

  if (
    !user ||
    (await user.checkIsJwtIssuedBeforeChaningPassword(decodedToken.iat))
  ) {
    return next(new AppError('Invalid token received!', 400));
  }

  req.user = user;
  next();
});
