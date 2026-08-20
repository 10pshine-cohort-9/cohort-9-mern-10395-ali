const logger = require('../config/logger');
const crypto = require('crypto');

/**
 * @param {any} err
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
const globalErrorHandler = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  const requestId = crypto.randomUUID();
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  logger.error({
    requestId,
    message: err.message,
    stack: err.stack,
    path: req.originalUrl,
    method: req.method,
    user: req.user?.id || 'anonymous'
  });

  if (process.env.NODE_ENV === 'development') {
    return res.status(err.statusCode).json({
      status: err.status,
      requestId,
      message: err.message,
      stack: err.stack
    });
  }

  res.status(err.statusCode).json({
    status: err.status,
    requestId,
    message: err.isOperational ? err.message : 'An internal error occurred'
  });
};

module.exports = globalErrorHandler;