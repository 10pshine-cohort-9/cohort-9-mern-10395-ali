const User = require('../models/User');
const AppError = require('../utils/AppError');

exports.getProfile = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) throw new AppError('User session invalid', 401);
    return user;
  } catch (err) {
    throw err;
  }
};

exports.updateProfile = async (userId, data) => {
  try {
    const { name } = data;
    if (!name) throw new AppError('Name cannot be empty', 400);
    return await User.update(userId, { name });
  } catch (err) {
    throw err;
  }
};