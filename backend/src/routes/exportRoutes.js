const express = require('express');
const exportController = require('../controllers/exportController');
const auth = require('../middlewares/authMiddleware');

const router = express.Router();
router.use(auth);

router.get('/export', exportController.exportNotes);
router.post('/import', exportController.importNotes);

module.exports = router;