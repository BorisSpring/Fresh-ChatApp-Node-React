onHandleEmitError = (appError, socketId, io) => {
  io.to(socketId).emit('error', {
    message: appError.message,
    statusCode: appError.statusCode,
  });
};

module.exports = (fn) => {
  return (eventDetails, socket, io) => {
    fn(eventDetails, socket, io).catch((err) => {
      onHandleEmitError(err, socket.id, io);
    });
  };
};
