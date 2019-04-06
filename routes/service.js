const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const service = require('../models/Services')
const response = require('../models/Helpers/ResponseDefault')
const jwt = require('jsonwebtoken')

router.post('/create', async (req, res) => {
    const data = new service(req.body)

    if(!data.validateSync()) {
        try {
            let result = await data.save();

            res.status(200).json({
                statusCode: 200,
                status: "OK",
                message: 'Serviço criado com sucesso',
                result: result
            })
        } catch(e) {
            res.status(500).json({
                statusCode: 500,
                status: "Internal Server Error",
                message: "Erro ao inserir o serviço",
                error: e
            })
        }
    }
})

module.exports = router
