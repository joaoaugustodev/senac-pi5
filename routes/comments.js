const express = require('express')
const router = express.Router()
const comments = require('../models/Comments')
const response = require('../models/Helpers/ResponseDefault')
const jwt = require('jsonwebtoken')

router.get("/", async (req, res) => {
    const data = await comments.find();
    res.json(data)
})

router.post('/create', async (req, res) => {
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

module.exports = router