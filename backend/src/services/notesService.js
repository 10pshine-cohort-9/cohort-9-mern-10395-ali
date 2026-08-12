const Note = require('../models/Note');
const AppError = require('../utils/AppError');

exports.fetchUserNotes = async (userId) => {
  return await Note.findAllByUserId(userId);
};

exports.createNewNote = async (userId, data) => {
  return await Note.create(userId, data.title, data.content);
};

exports.getNoteDetail = async (id, userId) => {
  const note = await Note.findById(id);
  if (!note || note.user_id !== userId) {
    throw new AppError('Note not found', 404);
  }
  return note;
};

exports.editNote = async (id, userId, data) => {
  const note = await Note.findById(id);
  if (!note || note.user_id !== userId) {
    throw new AppError('Note not found', 404);
  }
  return await Note.update(id, data.title, data.content);
};

exports.removeNote = async (id, userId) => {
  const note = await Note.findById(id);
  if (!note || note.user_id !== userId) {
    throw new AppError('Note not found', 404);
  }
  await Note.delete(id);
};