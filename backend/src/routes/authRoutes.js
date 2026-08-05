const express = require('express');
const Joi = require('joi');
const authController = require('../controllers/authController');
const validate = require('../middlewares/validator');

const router = express.Router();

const signupSchema = Joi.object({
  name: Joi.string().trim().min(2).max(50).required(),
  email: Joi.string().trim().email().lowercase().required(),
  password: Joi.string().min(8).max(72).required()
}).required();

const loginSchema = Joi.object({
  email: Joi.string().trim().email().lowercase().required(),
  password: Joi.string().max(72).required()
}).required();

router.post('/signup', validate(signupSchema), authController.signup);
router.post('/login', validate(loginSchema), authController.login);

module.exports = router;