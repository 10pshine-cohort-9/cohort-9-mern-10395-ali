const notesService = require('../services/notesService');
const catchAsync = require('../utils/catchAsync');
const response = require('../utils/response');

exports.getNotes = catchAsync(async (req, res) => {
  const notes = await notesService.fetchUserNotes(req.user.id, req.query);
  response.send(res, 200, { notes });
});

exports.createNote = catchAsync(async (req, res) => {
  const note = await notesService.createNewNote(req.user.id, req.body);
  response.send(res, 201, { note });
});

exports.getNote = catchAsync(async (req, res) => {
  const note = await notesService.getNoteDetail(req.params.id, req.user.id);
  response.send(res, 200, { note });
});

exports.updateNote = catchAsync(async (req, res) => {
  const note = await notesService.editNote(req.params.id, req.user.id, req.body);
  response.send(res, 200, { note });
});

exports.deleteNote = catchAsync(async (req, res) => {
  await notesService.removeNote(req.params.id, req.user.id);
  response.send(res, 204, null);
});