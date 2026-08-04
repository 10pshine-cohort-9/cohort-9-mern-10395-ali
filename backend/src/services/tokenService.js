const jwt = require('jsonwebtoken');

exports.generate = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '90d' });
};

exports.verify = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};