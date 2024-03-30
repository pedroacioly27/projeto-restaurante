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
    const usuario_id = req.usuario.id
    const { id } = req.params
    const { valor, descricao, tipo } = req.body

    if (!valor && !descricao && !tipo) {
        return res.status(400).json({ mensagem: 'Precisa informar ao menos um campo para atualizar' })
    }
    if (tipo !== 'entrada' && tipo !== 'saida') {
        return res.status(400).json({ mensagem: 'Precisa informar o tipo de transação corretamente' })
    }
    try {
        const buscarTransacao = await knex('transacoes').where({ id, usuario_id }).first()
        if (!buscarTransacao) {
            return res.status(404).json({ mensagem: "Registro não encontrado" })
        }
        const editarTransacao = await knex('transacoes').update({ valor, descricao, tipo }).where({ id, usuario_id }).returning('*')
        const transacaoFormatada = {
            id,
            valor: `R$${(editarTransacao[0].valor / 100).toFixed(2)}`,
            tipo: editarTransacao[0].tipo,
            data: editarTransacao[0].data,
            descricao: editarTransacao[0].descricao
        }
        return res.json(transacaoFormatada)
    } catch (error) {
        return res.status(500).json({ mensagem: 'Erro interno do servidor' })

    }
}
const transacoes = async (req, res) => {
    const { id } = req.usuario
    try {
        const entrada = await knex('transacoes').where({ usuario_id: id, tipo: 'entrada' })
        const saida = await knex('transacoes').where({ usuario_id: id, tipo: 'saida' })

        if (entrada.length === 0 && saida.length === 0) {
            return res.status(404).json({ mensagem: 'Nenhuma transação encontrada!' })
        }

        let valorEntrada = 0
        let valorSaida = 0
        for (const registro of entrada) {
            valorEntrada += registro.valor
        }
        for (const registro of saida) {
            valorSaida += registro.valor
        }

        return res.json({
            entrada: {
                total_entrada: `R$${((valorEntrada) / 100).toFixed(2)}`,
                registros: entrada.map((registro) => {
                    return {
                        id: registro.id,
                        tipo: registro.tipo,
                        descricao: registro.descricao,
                        valor: `R$${((registro.valor) / 100).toFixed(2)}`,
                        data: registro.data
                    }
                })
            },
            saida: {
                total_saida: `R$${((valorSaida) / 100).toFixed(2)}`,
                registros: saida.map((registro) => {
                    return {
                        id: registro.id,
                        tipo: registro.tipo,
                        descricao: registro.descricao,
                        valor: `R$${((registro.valor) / 100).toFixed(2)}`,
                        data: registro.data
                    }
                })
            }
        })
    } catch (error) {
        return res.status(500).json({ mensagem: 'Erro interno do servidor' })
    }
}

const deletarTransacao = async (req, res) => {
    const usuario_id = req.usuario.id
    const { id } = req.params
    try {
        const deletar = await knex('transacoes').where({ id, usuario_id }).del()
        if (deletar === 0) {
            return res.status(404).json({ mensagem: 'Transação não encontrada' })
        }
        return res.status(200).json({ mensagem: 'Transação deletada com sucesso!' })
    } catch (error) {
        return res.status(500).json({ mensagem: 'Erro interno do servidor' })
    }
}

const extrato = async (req, res) => {
    const { id } = req.usuario
    try {
        const entrada = await knex('transacoes').where({ usuario_id: id, tipo: 'entrada' })
        const saida = await knex('transacoes').where({ usuario_id: id, tipo: 'saida' })
        let valorEntrada = 0
        let valorSaida = 0
        for (const registro of entrada) {
            valorEntrada += registro.valor
        }
        for (const registro of saida) {
            valorSaida += registro.valor
        }

        const resultado = {
            valor_entrada: `R$${((valorEntrada) / 100).toFixed(2)}`,
            valor_saida: `R$${((valorSaida) / 100).toFixed(2)}`,
            saldo_empresa: `R$${((valorEntrada - valorSaida) / 100).toFixed(2)}`

        }



        return res.json(resultado)
    } catch (error) {
        return res.status(500).json({ mensagem: 'Erro interno do servidor' })
    }

}


module.exports = {
    adicionarTransacao,
    atualizarTransacao,
    transacoes,
    extrato,
    deletarTransacao
}