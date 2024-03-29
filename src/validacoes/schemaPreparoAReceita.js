const joi = require('joi')


const schemaPreparoAReceita = joi.object({
    receita: joi.string().required().messages({
        'any.required': 'O campo receita é obrigatório!',
        'string.empty': 'O campo receita é obrigatório!'
    }),
    preparo: joi.string().required().messages({
        'any.required': 'O campo preparo é obrigatório!',
        'string.empty': 'O campo preparo é obrigatório!'
    }),
    peso: joi.number().required().messages({
        'any.required': 'O campo peso é obrigatório!',
        'string.empty': 'O campo peso é obrigatório!',
        'number.base': 'O peso precisa ser um número válido',
        'number.positive': 'O peso precisa ser um número válido'


    })
})


module.exports = schemaPreparoAReceita
