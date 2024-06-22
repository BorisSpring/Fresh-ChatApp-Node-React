const multer = require('multer');
const sharp = require('sharp');

// utils
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

// models
const User = require('../models/userModel');

// multer and sharp configuration for uploading photos
const multerStorage = multer.memoryStorage();

const multerFileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new AppError('Only images allowed!', 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFileFilter,
});

exports.uploadUserPhoto = upload.single('photo');

exports.resizeAndAddPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) {
    return next(new AppError('Please provide image!', 400));
  }

  req.file.filename = `${req.user._id}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(80, 80)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/${req.file.filename}`);

  req.user.image = req.file.filename;

  req.user.save({ validateBeforeSave: false });

  // dodati posle brisanje slike usera
  res.status(200).json({
    status: 'Success',
    imageName: req.file.filename,
  });
});

// get logged user details
exports.getMe = catchAsync(async (req, res, next) => {
  req.user.password = undefined;
  req.user.isBanned = undefined;
  req.user.isActive = undefined;

  res.status(200).json({
    status: 'success',
    user: req.user,
  });
});

// chanign user accont details information
exports.updateUserDetails = catchAsync(async (req, res, next) => {
  const { name, email, lastName, statusText } = req.body;

  req.user.name = name;
  req.user.email = email;
  req.user.lastName = lastName;
  req.user.statusText = statusText;

  if (!name || !email || !lastName)
    return next(new AppError('All fields are required!'));

  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    { name, email, lastName },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!updatedUser) {
    return next(new AppError('Failed to update user', 500));
  }

  res.status(200).json({
    status: 'success',
    message: 'Susccessfully updated settings!',
  });
});

// searching user that we want to start chat
exports.getUsersForSideBar = catchAsync(async (req, res, next) => {
  const users = await User.find({
    _id: { $ne: req.user._id },
    email: { $regex: `^${req.query.email}` },
  }).select('name lastName id image email');

  res.status(200).json({
    status: 'success',
    data: users,
  });
});
