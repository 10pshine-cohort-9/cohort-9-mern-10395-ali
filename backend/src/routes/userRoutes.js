const express = require('express');
const userController = require('../controllers/userController');
const auth = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(auth);

router.get('/me', userController.getMe);

module.exports = router;