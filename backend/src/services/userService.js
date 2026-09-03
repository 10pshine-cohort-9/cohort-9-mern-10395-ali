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

