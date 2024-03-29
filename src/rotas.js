const express = require('express')
const { insumos, cadastroInsumo, atualizarInsumo, deletarInsumo } = require('./controladores/insumos')
const { adicionarPreparo, listarPreparos, adicionarInsumoAoPreparo } = require('./controladores/preparos')
const { cadastrarReceitas, receitas, deletarReceita, atualizarReceita, adicionarInsumoAReceita, adicionarPreparoAReceita } = require('./controladores/receitas')
const { cadastroUsuario, login, usuarioLogado, atualizarDadosUsuario } = require('./controladores/usuario')
const { autenticacaoUsuario } = require('./controladores/intermediarios/autenticacao')
const validarCorpoRequisicao = require('./controladores/intermediarios/validarCorpoDaRequisicao')
const schemaUsuario = require('./validacoes/schemaUsuario')
const { adicionarTransacao } = require('./controladores/transacoes')
const schemaLogin = require('./validacoes/schemaLogin')
const schemaInsumo = require('./validacoes/schemaInsumo')
const schemaInsumoAoPreparo = require('./validacoes/schemaInsumoAoPreparo')
const schemaPreparo = require('./validacoes/schemaPreparo')
const schemaInsumoAReceita = require('./validacoes/schemaInsumoAReceita')
const schemaPreparoAReceita = require('./validacoes/schemaPreparoAReceita')
const schemaReceita = require('./validacoes/schemaReceita')
const schemaTransacao = require('./validacoes/schemaTransacao')
const rotas = express()



rotas.post('/cadastro', validarCorpoRequisicao(schemaUsuario), cadastroUsuario)
rotas.post('/login', validarCorpoRequisicao(schemaLogin), login)

rotas.use(autenticacaoUsuario)

rotas.get('/usuarios', usuarioLogado)
rotas.put('/usuarios', atualizarDadosUsuario)

rotas.get('/insumos', insumos)
rotas.post('/insumos', validarCorpoRequisicao(schemaInsumo), cadastroInsumo)
rotas.patch('/insumos', atualizarInsumo)
rotas.delete('/insumos', deletarInsumo)

rotas.get('/preparos', listarPreparos)
rotas.post('/preparos', validarCorpoRequisicao(schemaPreparo), adicionarPreparo)
rotas.post('/preparos/insumos', validarCorpoRequisicao(schemaInsumoAoPreparo), adicionarInsumoAoPreparo)

rotas.get('/receitas', receitas)
rotas.post('/receitas', validarCorpoRequisicao(schemaReceita), cadastrarReceitas)
rotas.put('/receitas', atualizarReceita)
rotas.delete('/receitas', deletarReceita)
rotas.post('/receitas/insumo', validarCorpoRequisicao(schemaInsumoAReceita), adicionarInsumoAReceita)
rotas.post('/receitas/preparo', validarCorpoRequisicao(schemaPreparoAReceita), adicionarPreparoAReceita)

rotas.post('/transacoes',validarCorpoRequisicao(schemaTransacao), adicionarTransacao)

module.exports = rotas

