const bcrypt = require('bcrypt');

exports.hash = async (password) => {
  try {
    return await bcrypt.hash(password, 12);
  } catch (err) {
    throw err;
  }
};

exports.compare = async (password, hashed) => {
  try {
    return await bcrypt.compare(password, hashed);
  } catch (err) {
    throw err;
  }
};