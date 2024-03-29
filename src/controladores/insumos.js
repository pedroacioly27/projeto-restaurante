const knex = require('../conexao');


const insumos = async (req, res) => {
    const { id } = req.usuario

    try {
        const resultado = await knex('insumos').where({ usuario_id: id })
        return res.json(resultado)

    } catch (error) {
        return res.status(500).json({ mensagem: 'Erro interno do servidor' })
    }
}
const cadastroInsumo = async (req, res) => {
    const { nome, peso, valor } = req.body
    const { id } = req.usuario
    try {

        const buscarInsumo = await knex('insumos').where({ nome, usuario_id: id }).first()
        if (buscarInsumo) {
            return res.status(400).json({ mensagem: 'Insumo já cadastrado' })
        }

        const adicionarInsumo = await knex('insumos').insert({ nome, peso, valor, usuario_id: id }).returning(['*'])

        return res.status(201).json(adicionarInsumo)

    } catch (error) {
        return res.status(500).json({ mensagem: 'Erro interno do servidor' })

    }
}

const atualizarInsumo = async (req, res) => {
    const { nome, peso, valor, novoNome } = req.body
    const { id } = req.usuario
    if (!nome) {
        return res.status(400).json({ mensagem: 'Precisa informar o nome para atualizar os dados' })
    }
    if (!peso && !valor && !novoNome) {
        return res.status(400).json({ mensagem: 'Precisa informar ao menos um campo para atualizar' })
    }
    try {
        const buscarInsumos = await knex('insumos').where({ nome, usuario_id: id }).first()
        if (!buscarInsumos) {
            return res.status(404).json({ mensagem: 'Insumo não encontrado' })
        }
        if (novoNome) {
            const buscarNome = await knex('insumos').where({ nome: novoNome, usuario_id: id }).first()

            if (buscarNome && buscarNome.nome !== buscarInsumos.nome) {
                return res.status(400).json({ mensagem: "Nome já cadastrado" })
            }
        }

        const atualizar = await knex('insumos').update({ nome: novoNome ?? nome, peso, valor }).where({ nome, usuario_id: id }).returning(['*'])
        return res.status(200).json({
            mensagem: 'atualizado com sucesso',
            insumo: atualizar
        })


    } catch (error) {
        return res.status(500).json({ mensagem: 'Erro interno do servidor' })

    }
}



const deletarInsumo = async (req, res) => {
    const { nome } = req.body
    const { id } = req.usuario
    if (!nome) {
        return res.status(400).json({ mensagem: 'Precisa informar o nome para deletar' })
    }
    try {
        const deletar = await knex('insumos').delete().where({ nome, usuario_id: id })

        if (deletar === 0) {
            return res.status(404).json({ mensagem: 'Insumo não encontrado' })
        }
        if (deletar === 1) {
            return res.status(200).json({ mensagem: 'Deletado com sucesso' })
        }

    } catch (error) {
        console.log(error);
        return res.status(500).json({ mensagem: 'Erro interno do servidor' })
    }
}

module.exports = {
    insumos,
    cadastroInsumo,
    atualizarInsumo,
    deletarInsumo
}