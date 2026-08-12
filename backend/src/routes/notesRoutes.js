const express = require('express');
const notesController = require('../controllers/notesController');
const auth = require('../middlewares/authMiddleware');
const validate = require('../middlewares/validator');
const { noteSchema } = require('../validations/noteValidation');

const router = express.Router();

router.use(auth);

router.route('/')
  .get(notesController.getNotes)
  .post(validate(noteSchema), notesController.createNote);

router.route('/:id')
  .get(notesController.getNote)
  .put(validate(noteSchema), notesController.updateNote)
  .delete(notesController.deleteNote);

module.exports = router;