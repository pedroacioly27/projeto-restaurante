const knex = require('../conexao');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


const cadastroUsuario = async (req, res) => {
    const { nome, email, senha } = req.body
    try {
        const senhaCriptografada = await bcrypt.hash(senha, 10)
        const verificarEmail = await knex('usuarios').where({ email }).first()

        if (verificarEmail) {
            return res.status(400).json({ mensagem: 'Email já cadastrado' })
        }

        const cadastro = await knex('usuarios').insert({ nome, email, senha: senhaCriptografada }).returning(['id', 'nome', 'email'])


        return res.status(201).json(cadastro)

    } catch (error) {
        return res.status(500).json({ mensagem: 'Erro interno do servidor' })
    }

}
const login = async (req, res) => {
    const { email, senha } = req.body
    try {
        const usuario = await knex('usuarios').where({ email }).first()

        if (!usuario) {
            return res.status(400).json({ mensagem: 'Email ou senha inválido' })
        }

        const senhaValidada = await bcrypt.compare(senha, usuario.senha)
        if (!senhaValidada) {
            return res.status(400).json({ mensagem: 'Email ou senha inválido' })
        }

        const token = jwt.sign({ id: usuario.id }, process.env.JWT_PASS, { expiresIn: '8h' })

        const usuarioLogado = {
            id: usuario.id,
            nome: usuario.nome,
            email: usuario.email
        }

        return res.status(200).json({
            usuario: usuarioLogado,
            token
        })
    } catch (error) {
        return res.status(500).json(error.message)
    }
}

const usuarioLogado = async (req, res) => {
    return res.status(200).json({
        id: req.usuario.id,
        nome: req.usuario.nome,
        email: req.usuario.email,
    })
}

const atualizarDadosUsuario = async (req, res) => {
    const { nome, email, senha } = req.body
    const { id } = req.usuario
    if (!nome && !email && !senha) {
        return res.status(400).json({ mensagem: 'Deve informar ao menos um campo para ser atualizado!' })
    }
    try {
        const usuario = await knex('usuarios').where({ id }).first()
        const validarEmail = await knex('usuarios').where({ email }).first()

        if (validarEmail) {
            if (usuario.email !== validarEmail.email) {
                return res.status(400).json({ mensagem: 'Email já cadastrado' })
            }
        }
        if (senha) {
            const senhaCriptografada = await bcrypt.hash(senha, 10)
            const usuarioAtualizado = await knex('usuarios').where({ id }).update({ nome, email, senha: senhaCriptografada })
            return res.status(204).json()
        }
        const usuarioAtualizado = await knex('usuarios').where({ id }).update({ nome, email })

        return res.status(204).json()

    } catch (error) {
        return res.status(500).json({ mensagem: 'Erro interno do servidor' })
    }
}






module.exports = {
    cadastroUsuario,
    login,
    usuarioLogado,
    atualizarDadosUsuario
}