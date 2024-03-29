const knex = require('../conexao');


const adicionarTransacao = async (req, res) => {
    const { valor, descricao, tipo, data } = req.body
    const { id } = req.usuario
    if (tipo !== 'entrada' && tipo !== 'saida') {
        return res.status(400).json({ mensagem: 'Precisa informar o tipo de transação corretamente' })
    }
    try {
        const registroDeTransacao = await knex('transacoes').insert({ valor, descricao, tipo, data, usuario_id: id }).returning('*')
        const registroFormatado = {
            valor: `R$${(valor / 100).toFixed(2)}`,
            tipo,
            data: data ?? registroDeTransacao[0].data,
            descricao
        }
        return res.status(201).json(registroFormatado)
    } catch (error) {
        return res.status(500).json({ mensagem: 'Erro interno do servidor' })
    }
}
const atualizarTransacao = async (req, res) => {
    const { id } = req.params
    const { valor, descricao, tipo } = req.body
    if (!id) {
        return res.status(400).json({ mensagem: 'Precisa informar o ID do registro' })
    }
    if (!valor && !descricao && !tipo) {
        return res.status(400).json({ mensagem: 'Precisa informar ao menos um campo para atualizar' })
    }
    if (tipo !== 'entrada' && tipo !== 'saida') {
        return res.status(400).json({ mensagem: 'Precisa informar o tipo de transação corretamente' })
    }
    try {
        const buscarEntrada = await knex('entrada').where({ id }).first()
        if (!buscarEntrada) {
            return res.status(404).json({ mensagem: "Registro não encontrado" })
        }
        const editarEntrada = await knex('entrada').update({ valor, descricao }).where({ id }).returning('*')

        return res.json(editarEntrada[0])
    } catch (error) {
        return res.status(500).json({ mensagem: 'Erro interno do servidor' })

    }
}




module.exports = {
    adicionarTransacao,
    atualizarTransacao
}