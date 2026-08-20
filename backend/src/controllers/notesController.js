const notesService = require('../services/notesService');
const catchAsync = require('../utils/catchAsync');
const response = require('../utils/response');

exports.getNotes = catchAsync(async (req, res) => {
  try {
    const notes = await notesService.fetchUserNotes(req.user.id, req.query);
    response.send(res, 200, { notes });
  } catch (err) {
    throw err;
  }
});

exports.createNote = catchAsync(async (req, res) => {
  try {
    const note = await notesService.createNewNote(req.user.id, req.body);
    response.send(res, 201, { note });
  } catch (err) {
    throw err;
  }
});

exports.getNote = catchAsync(async (req, res) => {
  try {
    const note = await notesService.getNoteDetail(req.params.id, req.user.id);
    response.send(res, 200, { note });
  } catch (err) {
    throw err;
  }
});

exports.updateNote = catchAsync(async (req, res) => {
  try {
    const note = await notesService.editNote(req.params.id, req.user.id, req.body);
    response.send(res, 200, { note });
  } catch (err) {
    throw err;
  }
});

exports.deleteNote = catchAsync(async (req, res) => {
  try {
    await notesService.removeNote(req.params.id, req.user.id);
    response.send(res, 204, null);
  } catch (err) {
    throw err;
  }
});