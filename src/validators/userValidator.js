const Joi = require('joi');

const updateMyProfileSchema = Joi.object({
  user_name: Joi.string().min(3),
  user_email: Joi.string().email(),
}).min(1).unknown(false);

/*

Understand three important things
1. .min(1) — at least one field must be provided.
2. .unknown(false) — rejects additional fields such as user_role and password.
3. Fields aren't .required() — because users can update just their name or just their email.

*/

const changeMyPasswordSchema = Joi.object({
  currentPassword: Joi.string().required(),
  newPassword: Joi.string().min(6).required(),
}).unknown(false);


module.exports = {
  updateMyProfileSchema,
  changeMyPasswordSchema
};
