const joi = require("joi");

const billingSchema = joi.object({
    value: joi.number().required().positive().messages({
        "number.base": "O campo valor deve ser do tipo número",
        "any.required": "O campo valor é obrigatório",
        "number.empty": "O campo valor é obrigatório",
        "number.positive": "O campo valor deve ser positivo",
    }),

    due_date: joi.date().required().messages({
        "date.base": "O campo data de vencimento deve ser do tipo data",
        "any.required": "O campo data de vencimento é obrigatório",
        "date.empty": "O campo data de vencimento é obrigatório",
    }),

    status: joi.string().required().messages({
        "any.required": "O campo status é obrigatório",
        "string.empty": "O campo status é obrigatório",
        "string.base": "O campo status deve ser do tipo texto",
    }),

    description: joi.any(),

    payment_date: joi.any()

})

module.exports = billingSchema