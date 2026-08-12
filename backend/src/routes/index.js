const express = require('express');
const authRoutes = require('./authRoutes');
const notesRoutes = require('./notesRoutes');
const router = express.Router();

router.use('/auth', authRoutes);
router.use('/notes', notesRoutes);

module.exports = router;