const joi = require('joi')


const schemaAtualizarTransacao = joi.object({
    tipo: joi.string().messages({
        'any.required': 'O campo tipo é obrigatório!',
        'string.empty': 'O campo tipo é obrigatório!'
    }),
    descricao: joi.string().messages({
        'any.required': 'O campo descricao é obrigatório!',
        'string.empty': 'O campo descricao é obrigatório!'
    }),
    data: joi.string().regex(/^\d{2}\-\d{2}\-\d{4}$/).messages({
        'string.pattern.base': 'Data deve estar no formato dd-mm-aaaa'
    }),
    valor: joi.number().messages({
        'any.required': 'O campo valor é obrigatório!',
        'string.empty': 'O campo valor é obrigatório!',
        'number.base': 'O valor precisa ser um número válido',
        'number.positive': 'O valor precisa ser um número válido'


    })
})


module.exports = schemaAtualizarTransacao
