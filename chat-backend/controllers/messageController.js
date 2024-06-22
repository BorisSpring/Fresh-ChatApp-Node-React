// utils
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

// models
const Message = require('../models/messageModel');

exports.downloadFileFromMessage = catchAsync(async (req, res, next) => {
  const message = await Message.findById(req.params.messageId);

  if (!message) return next(new AppError('No message found', 404));

  if (!message.visibleFor.some((userId) => !userId.equals(req.user._id)))
    return next(
      new AppError('U dont have permission to download this file!', 403)
    );

  if (!message.fileUrl && !message.imageUrl)
    return next(new AppError('This is text message!', 400));

  const filePath = `${__dirname}/../public/img/${
    message.fileUrl || message.imageUrl
  }`;

  // Preuzimanje fajla
  res.download(filePath, (err) => {
    if (err) {
      console.error('Error downloading file:', err);
      return next(new AppError('Error downloading file.', 500));
    }
  });
});
