const authService = require('../services/authService');
const tokenService = require('../services/tokenService');
const catchAsync = require('../utils/catchAsync');
const response = require('../utils/response');

exports.signup = catchAsync(async (req, res) => {
  const { name, email, password } = req.body;
  const user = await authService.register(name, email, password);
  const token = tokenService.generate(user.id);
  response.send(res, 201, { user, token });
});

exports.login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const user = await authService.login(email, password);
  const token = tokenService.generate(user.id);
  delete user.password_hash;
  response.send(res, 200, { user, token });
});