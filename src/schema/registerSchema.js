const joi = require("joi");

const registerSchema = joi.object({
  name: joi.string().required().messages({
    "any.required": "O campo nome é obrigatório",
    "string.empty": "O campo nome é obrigatório",
  }),

  email: joi.string().email().required().messages({
    "any.required": "O campo e-mail é obrigatório",
    "string.email": "O campo e-mail é inválido",
    "string.empty": "O campo e-mail é obrigatório",
    "string.base": "O campo e-mail deve ser do tipo texto",
  }),

  password: joi.string().required().messages({
    "any.required": "O campo senha é obrigatório",
    "string.empty": "O campo senha é obrigatório",
    "string.base": "O campo senha deve ser do tipo texto",
  }),
});

module.exports = registerSchema;
