const User = require('../models/User');
const passwordService = require('./passwordService');
const AppError = require('../utils/AppError');

exports.register = async (name, email, password) => {
  try {
    const hash = await passwordService.hash(password);
    return await User.create(name, email, hash);
  } catch (err) {
    if (err.code === '23505') {
      throw new AppError('Email already in use', 400);
    }
    throw err;
  }
};

exports.login = async (email, password) => {
  try {
    const user = await User.findByEmail(email);
    if (!user || !(await passwordService.compare(password, user.password_hash))) {
      throw new AppError('Invalid credentials', 401);
    }
    return user;
  } catch (err) {
    throw err;
  }
};