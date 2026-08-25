const Note = require('../models/Note');

exports.generateUserData = async (userId) => {
  const notes = await Note.findAllByUserId(userId);
  return JSON.stringify(notes, null, 2);
};