const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const { pool } = require('./config')
const { request, response } = require('express')

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())

const getProdutos = (request, response) => {
    pool.query('SELECT * FROM produtos', (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    })
}

const addProduto = (request, response) => {
    const { nome, preco, estoque } = request.body

    pool.query(
        'INSERT INTO PRODUTOS (nome, preco, estoque) values ($1, $2, $3)',
        [nome, preco, estoque],
        (error) => {
            if (error) {
                throw error
            }
            response.status(201).json({ status: 'success', message: 'Produto criado com sucesso' })
        }
    )
}


const updateProduto = (request, response) => {
    const { codigo, nome, preco, estoque } = request.body
    pool.query(
        'UPDATE produtos set nome = $1, preco=$2, estoque = $3 where codigo=$4',
        [nome, preco, estoque, codigo],
        (error, results) => {
            if (error || results.rowCount == 0) {
                return response.status(401).json({ status: 'error', message: 'Não foi possivel atualizar o produto' });
            }
            return response.status(201).json({ status: 'success', message: 'Produto atualizado com sucesso' })
        },
    )
}

const deleteProduto = (request, response) => {
    const codigo = parseInt(request.params.id)

    pool.query(
        'DELETE from produtos where codigo=$1',
        [codigo],
        (error, results) => {
            if (error || results.rowCount == 0) {
                return response.status(401).json({ status: 'error', message: 'Não foi possivel remover o produto' });
            }
            response.status(201).json({ status: 'success', message: 'Produto removido com sucesso' })
        },
    )
}

const getProdutosPorID = (request, response) => {
    const codigo = parseInt(request.params.id)
    pool.query('SELECT * FROM produtos where codigo = $1', [codigo], (error, results) => {
        if (error || results.rowCount == 0) {
            return response.status(401).json({ status: 'error', message: 'Não foi possivel recuperar o produto' });
        }
        response.status(200).json(results.rows)
    })
}


app
    .route('/api/produtos')
    .get(getProdutos)
    .post(addProduto)
    .put(updateProduto)
app.route('/api/produtos/:id')
    .get(getProdutosPorID)
    .delete(deleteProduto)


app.listen(process.env.PORT || 3002, () => {
    console.log('Servidor rodando a API');
})
