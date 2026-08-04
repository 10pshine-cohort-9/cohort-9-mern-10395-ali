const tokenService = require('../services/tokenService');
const User = require('../models/User');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

module.exports = catchAsync(async (req, res, next) => {
  let token;
  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) return next(new AppError('Please log in', 401));

  const decoded = tokenService.verify(token);
  const user = await User.findById(decoded.id);
  
  if (!user) return next(new AppError('User no longer exists', 401));

  req.user = user;
  next();
});