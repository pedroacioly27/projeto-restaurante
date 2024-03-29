const joi = require('joi')


const schemaPreparo = joi.object({
    nome: joi.string().required().messages({
        'any.required': 'O campo nome é obrigatório!',
        'string.empty': 'O campo nome é obrigatório!'
    }),
    peso: joi.number().required().messages({
        'any.required': 'O campo peso é obrigatório!',
        'string.empty': 'O campo peso é obrigatório!',
        'number.base': 'O peso precisa ser um número válido',
        'number.positive': 'O peso precisa ser um número válido'
    })
})


module.exports = schemaPreparo
