const userService = require('../services/userService');
const catchAsync = require('../utils/catchAsync');
const response = require('../utils/response');

exports.getMe = catchAsync(async (req, res) => {
  const user = await userService.getProfile(req.user.id);
  response.send(res, 200, { user });
});

exports.updateMe = catchAsync(async (req, res) => {
  const user = await userService.updateProfile(req.user.id, req.body);
  response.send(res, 200, { user });
});