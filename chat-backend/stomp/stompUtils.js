// authenthication controller methods
const {
  findUserByToken,
  verifyToken,
} = require('../controllers/authController');

const AppError = require('../utils/appError');

exports.getUserIdFromSocketHeader = async (socket) => {
  const token = socket.handshake.headers?.authorization?.split('Bearer ')?.[1];
  if (!token) {
    throw new AppError('Invalid token received!', 401);
  }
  const decodedToken = await verifyToken(token);
  return decodedToken.id;
};

// finding user from socket authorization header
exports.getUserFromSocketHeader = async (socket) => {
  const token = socket.handshake.headers?.authorization.split('Bearer ')?.[1];
  if (!token) throw new AppError('Invalid token received!');
  return await findUserByToken(token);
};
