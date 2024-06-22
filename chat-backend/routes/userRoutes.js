const express = require('express');

const { signUp, signIn, protect } = require('../controllers/authController');
const {
  getMe,
  updateUserDetails,
  getUsersForSideBar,
  uploadUserPhoto,
  resizeAndAddPhoto,
} = require('../controllers/userController');

const userRouter = express.Router();

// auth controller
userRouter.post('/signUp', signUp);
userRouter.post('/signIn', signIn);

// user controler
userRouter.get('/me', protect, getMe);
userRouter.patch(
  '/profilePicture',
  protect,
  uploadUserPhoto,
  resizeAndAddPhoto
);
userRouter.get('/allUsers', protect, getUsersForSideBar);
userRouter.patch('/updateSettings', protect, updateUserDetails);

module.exports = userRouter;
