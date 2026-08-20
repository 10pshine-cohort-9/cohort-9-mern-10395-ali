const globalErrorHandler = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  let statusCode = err.statusCode || 500;
  let status = err.status || 'error';

  if (!err.isOperational) {
    statusCode = 500;
    status = 'error';
  }

  req.log.error({
    err,
    path: req.originalUrl,
    method: req.method,
    user: req.user?.id || 'anonymous'
  });

  if (process.env.NODE_ENV === 'development') {
    return res.status(statusCode).json({
      status,
      requestId: req.id,
      message: err.message,
      stack: err.stack
    });
  }

  res.status(statusCode).json({
    status,
    requestId: req.id,
    message: err.isOperational ? err.message : 'An internal error occurred'
  });
};

module.exports = globalErrorHandler;