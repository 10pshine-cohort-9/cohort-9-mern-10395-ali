exports.send = (res, statusCode, data) => {
  res.status(statusCode).json({
    status: 'success',
    data
  });
};