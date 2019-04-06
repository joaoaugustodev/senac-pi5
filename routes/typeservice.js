const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const typeservice = require('../models/TypeServices')
const response = require('../models/Helpers/ResponseDefault')

router.post('/create', async (req, res) => {
    const data = new typeservice(req.body)

    if(!data.validateSync()) {
        try {
            let result = await data.save();

            res.status(200).json({
                statusCode: 200,
                status: "OK",
                message: 'Tipo de serviço criado com sucesso',
                result: result
            })
        } catch(e) {
            res.status(500).json({
                statusCode: 500,
                status: "Internal Server Error",
                message: "Erro ao inserir o tipo de serviço",
                error: e
            })
        }
    }
})

module.exports = router
