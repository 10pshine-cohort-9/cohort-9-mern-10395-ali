const exportService = require('../services/exportService');
const importService = require('../services/importService');
const catchAsync = require('../utils/catchAsync');
const response = require('../utils/response');

exports.exportNotes = catchAsync(async (req, res) => {
  const data = await exportService.generateUserData(req.user.id);
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Disposition', 'attachment; filename=notes_export.json');
  res.send(data);
});

exports.importNotes = catchAsync(async (req, res) => {
  const results = await importService.processImport(req.user.id, req.body);
  response.send(res, 200, results);
});