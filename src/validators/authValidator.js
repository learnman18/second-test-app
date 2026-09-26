const Joi = require('joi');
//we are using Joi, it's a validator package/library.
const registerSchema = Joi.object({
  user_name: Joi.string().min(3).required(), //here it says name should be string, at least 3 chars and mandatory.
  user_email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

module.exports = {
  registerSchema,
};