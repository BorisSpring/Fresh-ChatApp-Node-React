const sendErrorDevlopemnt = (err, res) => {
  res.status(err.statusCode || 500).json({
    status: err.status,
    errorName: err.name,
    err: err,
    message: err.message,
    isOperational: err.isOperational,
    stack: err.stack,
  });
};

const sendErorrProd = (err, res) => {
  res.status(err?.statusCode || 500).json({
    status: 'Fail',
    message: err?.isOperational ? err.message : 'Ops Something went wrong!',
  });
};

const handleCastError = (err, res) => {
  res.status(err.statusCode || 500).json({
    status: 'Fail',
    message: `Input id for value (${err.value}) is not valid!`,
  });
};

const handleValidationError = (err, res) => {
  const message = {};

  Object.keys(err.errors).forEach(
    (key) => (message[key] = err.errors[key].message)
  );

  res.status(400).json({
    status: 'Fail',
    message,
  });
};

const handleUniqunessError = (err, res) => {
  const key = Object.keys(err.errorResponse.keyPattern);

  res.status(400).json({
    status: 'Fail',
    messages: {
      [key]: `Value for input ${err.errorResponse.keyValue[key]} shoud be unique! Please chose another one!`,
    },
  });
};

const handleJwtSignatureError = (res) => {
  res.status(401).json({
    status: 'Fail',
    message: 'Invalid jwt token received!',
  });
};

const handleTokenExpiredError = (res) => {
  res.status(401).json({
    status: 'Fail',
    message: 'Token expired! Please login again!',
  });
};

module.exports = (err, req, res, next) => {
  if (process.env.NODE_ENV === 'development') {
    sendErrorDevlopemnt(err, res);
  } else {
    if (err.name === 'CastError') {
      handleCastError(err, res);
    } else if (err.errorResponse?.code === 11000) {
      handleUniqunessError(err, res);
    } else if (err.name === 'ValidationError') {
      handleValidationError(err, res);
    } else if (err.name === 'JsonWebTokenError') {
      handleJwtSignatureError(res);
    } else if (err.name === 'TokenExpiredError') {
      handleTokenExpiredError(res);
    } else {
      sendErorrProd(err, res);
    }
  }
};
