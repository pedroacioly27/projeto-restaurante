const joi = require('joi')


const schemaLogin = joi.object({
    email: joi.string().required().messages({
        'any.required': 'O campo email é obrigatório!',
        'string.empty': 'O campo email é obrigatório!'
    }),
    senha: joi.string().required().min(5).messages({
        'any.required': 'O campo senha é obrigatório!',
        'string.empty': 'O campo senha é obrigatório!',
        'string.min': 'A senha precisa conter no mínimo 5 caracteres'
    })
})


module.exports = schemaLogin
