const jwt = require("jsonwebtoken")
const knex = require('../../conexao')

const autenticacaoUsuario = async (req, res, next) => {
    const { authorization } = req.headers

    if (!authorization) {
        return res.status(401).json({ mensagem: 'Não autorizado' })
    }
    const token = authorization.split(" ")[1]
    try {
        try {
            const { id } = jwt.verify(token, process.env.JWT_PASS)
        } catch (error) {
            return res.status(401).json({ mensagem: 'Não autorizado' })
        }
        const { id } = jwt.verify(token, process.env.JWT_PASS)


        const usuario = await knex('usuarios').where({ id }).first()

        if (!usuario) {
            return res.status(401).json({ messagem: 'Não autorizado' })
        }

        req.usuario = usuario

        next()

    } catch (error) {
        return res.status(500).json({ mensagem: 'Erro interno do servidor' })
    }

}


module.exports = {
    autenticacaoUsuario
}