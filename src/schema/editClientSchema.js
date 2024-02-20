const Joi = require("joi");

const editClientSchema = Joi.object({

  id: Joi.any(),

  name: Joi.string().required().messages({
    "any.required": "O campo nome é obrigatório",
    "string.empty": "O campo nome é obrigatório",
  }),
  email: Joi.string().email().required().messages({
    "any.required": "O campo e-mail é obrigatório",
    "string.email": "O campo e-mail é inválido",
    "string.empty": "O campo e-mail é obrigatório",
    "string.base": "O campo e-mail deve ser do tipo texto",
  }),
  cpf: Joi.string().required().messages({
    "any.required": "O campo cpf é obrigatório",
    "string.empty": "O campo cpf é obrigatório",
  }),
  phone: Joi.string().required().messages({
    "any.required": "O campo telefone é obrigatório",
    "string.empty": "O campo telefone é obrigatório",
  }),

  zip_code: Joi.any(),

  address: Joi.any(),

  complementary_address: Joi.any(),

  neighborhood: Joi.any(),

  city: Joi.any(),

  state: Joi.any(),

});

module.exports = editClientSchema;
