const joi = require('joi')


const schemaTransacao = joi.object({
    tipo: joi.string().required().messages({
        'any.required': 'O campo tipo é obrigatório!',
        'string.empty': 'O campo tipo é obrigatório!'
    }),
    descricao: joi.string().required().messages({
        'any.required': 'O campo descricao é obrigatório!',
        'string.empty': 'O campo descricao é obrigatório!'
    }),
    data: joi.string().regex(/^\d{2}\/\d{2}\/\d{4}$/).required().messages({
        'string.pattern.base': 'Data deve estar no formato dd/mm/aaaa'
    }),
    valor: joi.number().required().messages({
        'any.required': 'O campo valor é obrigatório!',
        'string.empty': 'O campo valor é obrigatório!',
        'number.base': 'O valor precisa ser um número válido',
        'number.positive': 'O valor precisa ser um número válido'


    })
})


module.exports = schemaTransacao
