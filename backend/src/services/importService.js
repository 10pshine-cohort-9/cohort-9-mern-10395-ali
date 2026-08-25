const Note = require('../models/Note');
const AppError = require('../utils/AppError');

exports.processImport = async (userId, notesArray) => {
  if (!Array.isArray(notesArray)) {
    throw new AppError('Invalid file format: expected an array of notes', 400);
  }

  const results = { imported: 0, skipped: 0 };
  
  for (const item of notesArray) {
    const isValidItem = item !== null && 
                        typeof item === 'object' && 
                        typeof item.title === 'string' && 
                        typeof item.content === 'string' &&
                        item.title.trim().length > 0;

    if (isValidItem) {
      try {
        await Note.create(userId, item.title.trim(), item.content);
        results.imported++;
      } catch (err) {
        results.skipped++;
      }
    } else {
      results.skipped++;
    }
  }

  return results;
};