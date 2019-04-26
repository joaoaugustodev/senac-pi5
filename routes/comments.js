const express = require('express')
const router = express.Router()
const comments = require('../models/Comments')
const response = require('../models/Helpers/ResponseDefault')
const jwt = require('jsonwebtoken')
const verifyToken = require('../middleware/verifyJwt')

router.get("/", async (req, res) => {
    const data = await comments.find();
    res.json(data)
})

router.post('/create', verifyToken, async (req, res) => {

    if (!req.token) {
        return res.status(401).json(response.send('error401', null, 'O usuário não está autenticado.'))
    }

    const data = new comments(req.body)

    if(!data.validateSync()) {
        try {
            let result = await data.save();

            res.status(200).json({
                statusCode: 200,
                status: "OK",
                message: 'Comentário criado com sucesso',
                result: result
            })
        } catch(e) {
            res.status(500).json({
                statusCode: 500,
                status: "Internal Server Error",
                message: "Erro ao inserir o comentário",
                error: e
            })
        }
    }
})

//verificar se existe o owner e o jobber
//necessário verificar o token

module.exports = router