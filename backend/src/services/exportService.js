const Note = require('../models/Note');

exports.generateUserData = async (userId) => {
  try {
    const notes = await Note.findAllByUserId(userId);
    return JSON.stringify(notes, null, 2);
  } catch (err) {
    throw err;
  }
};