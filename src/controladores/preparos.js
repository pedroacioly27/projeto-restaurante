const knex = require('../conexao');

const listarPreparos = async (req, res) => {
    const { preparo } = req.query
    const { id } = req.usuario


    try {
        if (preparo) {
            const buscarPreparo = await knex('preparos').where({ nome: preparo, usuario_id: id }).first()
            if (!buscarPreparo) {
                return res.status(404).json({ mensagem: 'Preparo não encontrado' })
            }
            const buscarInsumos = await knex('insumo_preparo').where({ preparo_id: buscarPreparo.id, usuario_id: id })
            const insumoFormatado = []
            let valorUtilizado = 0
            for (let insumo of buscarInsumos) {
                const insumos = await knex('insumos').where({ id: insumo.insumo_id, usuario_id: id }).first()
                const formatarInsumos = {
                    insumo: insumos.nome,
                    valor_utilizado: `R$${((insumos.valor / insumos.peso) * insumo.peso_utilizado / 100).toFixed(2)}`
                }

                insumoFormatado.push(formatarInsumos)
                valorUtilizado += (insumos.valor / insumos.peso) * insumo.peso_utilizado
            }
            const gastosIncalculaveis = valorUtilizado + (valorUtilizado) / 4
            return res.json({
                preparo: buscarPreparo.nome,
                pesoDoPreparo: buscarPreparo.peso,
                valorDosInsumos: `R$${(valorUtilizado / 100).toFixed(2)}`,
                valorTotal: `R$${(gastosIncalculaveis / 100).toFixed(2)}`,
                insumos: insumoFormatado
            })
        }
        const resultado = await knex('preparos').where({ usuario_id: id })
        return res.json(resultado)
    } catch (error) {
        res.status(500).json({ mensagem: 'Erro interno do servidor' })
    }
}






const adicionarInsumoAoPreparo = async (req, res) => {
    const { peso, preparo, insumo } = req.body
    const { id } = req.usuario
    try {
        const buscarPreparo = await knex('preparos').where({ nome: preparo, usuario_id: id }).first()
        if (!buscarPreparo) {
            return res.status(404).json({ mensagem: 'Preparo não encontrado' })
        }
        const buscarInsumo = await knex('insumos').where({ nome: insumo, usuario_id: id }).first()
        if (!buscarInsumo) {
            return res.status(404).json({ mensagem: 'Insumo não encontrado' })
        }

        const buscar = await knex('insumo_preparo').where({
            usuario_id: id,
            preparo_id: buscarPreparo.id,
            insumo_id: buscarInsumo.id
        }).first()

        if (buscar) {
            return res.status(400).json({ mensagem: 'Insumo já foi cadastrado para esse preparo!' })
        }


        const adicionar = await knex('insumo_preparo').insert({
            preparo_id: buscarPreparo.id,
            insumo_id: buscarInsumo.id,
            usuario_id: id,
            peso_utilizado: peso,
        }).returning(['*'])

        res.status(201).json(adicionar)
    } catch (error) {
        res.status(500).json({ mensagem: 'Erro interno do servidor' })

    }
}

const adicionarPreparo = async (req, res) => {
    const { nome, peso } = req.body
    const { id } = req.usuario
    try {
        const procurarPreparo = await knex('preparos').where({ nome, usuario_id: id }).first()
        if (procurarPreparo) {
            return res.status(400).json({ mensagem: 'Esse preparo já foi adicionado' })
        }
        const resultado = await knex('preparos').insert({ nome, peso, usuario_id: id }).returning(['*'])
        res.status(201).json(resultado)

    } catch (error) {
        res.status(500).json({ mensagem: 'Erro interno do servidor' })
    }
}



module.exports = {
    adicionarPreparo,
    listarPreparos,
    adicionarInsumoAoPreparo
}