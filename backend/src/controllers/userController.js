const userService = require('../services/userService');
const catchAsync = require('../utils/catchAsync');
const response = require('../utils/response');

exports.getMe = catchAsync(async (req, res) => {
  try {
    const { id: userId } = req.user;

    const user = await userService.getProfile(userId);
    response.send(res, 200, { user });
  } catch (err) {
    throw err;
  }
});

exports.updateMe = catchAsync(async (req, res) => {
  try {
    const { id: userId } = req.user;
    const { name } = req.body;

    const user = await userService.updateProfile(userId, { name });
    response.send(res, 200, { user });
  } catch (err) {
    throw err;
  }
});