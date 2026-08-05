const authService = require('../services/authService');
const tokenService = require('../services/tokenService');
const catchAsync = require('../utils/catchAsync');
const response = require('../utils/response');
const AppError = require('../utils/AppError');

exports.signup = catchAsync(async (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return next(new AppError('Name, email, and password are required', 400));
  }

  const user = await authService.register(name, email, password);
  const token = tokenService.generate(user.id);

  delete user.password_hash;
  response.send(res, 201, { user, token });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError('Email and password are required', 400));
  }

  const user = await authService.login(email, password);
  const token = tokenService.generate(user.id);

  delete user.password_hash;
  response.send(res, 200, { user, token });
});