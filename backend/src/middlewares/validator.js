const Joi = require('joi');
const AppError = require('../utils/AppError');

module.exports = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body);
  if (error) {
    const message = error.details.map(el => el.message).join(', ');
    return next(new AppError(message, 400));
  }
  next();
};