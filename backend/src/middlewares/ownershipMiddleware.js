const Note = require('../models/Note');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

module.exports = catchAsync(async (req, res, next) => {
  const note = await Note.findById(req.params.id);
  if (!note) return next(new AppError('Note not found', 404));
  
  if (note.user_id !== req.user.id) {
    return next(new AppError('Access denied', 403));
  }
  next();
});