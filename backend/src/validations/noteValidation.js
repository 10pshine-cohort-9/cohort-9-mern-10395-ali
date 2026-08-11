const Joi = require('joi');

exports.noteSchema = Joi.object({
  title: Joi.string().trim().min(1).max(255).required(),
  content: Joi.string().allow('').required()
}).required();