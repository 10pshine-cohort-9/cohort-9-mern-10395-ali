const Note = require('../models/Note');
const AppError = require('../utils/AppError');

exports.processImport = async (userId, notesArray) => {
  if (!Array.isArray(notesArray)) throw new AppError('Invalid file format', 400);

  const results = { imported: 0, skipped: 0 };
  
  for (const item of notesArray) {
    if (item.title && item.content) {
      await Note.create(userId, item.title, item.content);
      results.imported++;
    } else {
      results.skipped++;
    }
  }
  return results;
};