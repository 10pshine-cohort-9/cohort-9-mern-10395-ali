const express = require('express');
const authRoutes = require('./authRoutes');
const notesRoutes = require('./notesRoutes');
const userRoutes = require('./userRoutes');
const router = express.Router();

router.use('/auth', authRoutes);
router.use('/notes', notesRoutes);
router.use('/users', userRoutes);

module.exports = router;