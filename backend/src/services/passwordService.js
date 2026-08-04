const bcrypt = require('bcrypt');

exports.hash = async (password) => {
  return await bcrypt.hash(password, 12);
};

exports.compare = async (password, hashed) => {
  return await bcrypt.compare(password, hashed);
};