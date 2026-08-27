const notesService = require('../services/notesService');
const catchAsync = require('../utils/catchAsync');
const response = require('../utils/response');
const { emitToUser } = require('../config/socket');

exports.getNotes = catchAsync(async (req, res) => {
  try {
    const { id: userId } = req.user;
    const filters = req.query;

    const notes = await notesService.fetchUserNotes(userId, filters);
    response.send(res, 200, { notes });
  } catch (err) {
    throw err;
  }
});

exports.createNote = catchAsync(async (req, res) => {
  try {
    const { id: userId } = req.user;
    const { title, content } = req.body;

    const note = await notesService.createNewNote(userId, { title, content });

    emitToUser(userId, 'note:created', { message: 'New note added' });

    response.send(res, 201, { note });
  } catch (err) {
    throw err;
  }
});

exports.getNote = catchAsync(async (req, res) => {
  try {
    const { id: userId } = req.user;
    const { id: noteId } = req.params;

    const note = await notesService.getNoteDetail(noteId, userId);
    response.send(res, 200, { note });
  } catch (err) {
    throw err;
  }
});

exports.updateNote = catchAsync(async (req, res) => {
  try {
    const { id: userId } = req.user;
    const { id: noteId } = req.params;
    const { title, content } = req.body;

    const note = await notesService.editNote(noteId, userId, { title, content });

    emitToUser(userId, 'note:updated', { id: noteId });

    response.send(res, 200, { note });
  } catch (err) {
    throw err;
  }
});

exports.deleteNote = catchAsync(async (req, res) => {
  try {
    const { id: userId } = req.user;
    const { id: noteId } = req.params;

    const newDeletedCount = await notesService.removeNote(noteId, userId);

    emitToUser(userId, 'note:deleted', { 
      id: noteId, 
      newDeletedCount: newDeletedCount 
    });

    response.send(res, 204, null);
  } catch (err) {
    throw err;
  }
});