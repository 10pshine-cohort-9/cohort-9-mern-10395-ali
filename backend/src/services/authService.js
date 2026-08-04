const User = require('../models/User');
const passwordService = require('./passwordService');
const AppError = require('../utils/AppError');

exports.register = async (name, email, password) => {
  const existing = await User.findByEmail(email);
  if (existing) throw new AppError('Email already in use', 400);

  const hash = await passwordService.hash(password);
  return await User.create(name, email, hash);
};

exports.login = async (email, password) => {
  const user = await User.findByEmail(email);
  if (!user || !(await passwordService.compare(password, user.password_hash))) {
    throw new AppError('Invalid credentials', 401);
  }
  return user;
};