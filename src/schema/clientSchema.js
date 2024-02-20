const joi = require("joi");

const clientSchema = joi.object({

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

  cpf: joi.string().required().messages({
    "string.empty": "O campo cpf é obrigatório",
    "any.required": "O campo cpf é obrigatório",
    "string.base": "O campo cpf deve ser do tipo texto"
  }),

  phone: joi.number().integer().positive().required().messages({
    "number.positive": "O campo telefone é inválido",
    "number.base": "O campo telefone é inválido",
    "any.required": "O campo telefone é obrigatório",
  }),

  zip_code: joi.any(),

  address: joi.any(),

  complementary_address: joi.any(),

  neighborhood: joi.any(),

  city: joi.any(),

  state: joi.any(),
});

module.exports = clientSchema;
