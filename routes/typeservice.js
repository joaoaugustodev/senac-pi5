const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const typeservice = require('../models/TypeServices')
const response = require('../models/Helpers/ResponseDefault')
const verifyToken = require('../middleware/verifyJwt')

router.post('/create', verifyToken, async (req, res) => {

    if (!req.token) {
        return res.status(401).json(response.send('error401', null, 'O usuário não está autenticado.'))
    }

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

router.get('/', verifyToken, async (req, res) => {

    if (!req.token) {
        return res.status(401).json(response.send('error401', null, 'O usuário não está autenticado.'))
    }
    
    try{
        const data = await typeservice.find();
        res.status(200).json({
            statusCode: 200,
            status: "OK",
            message: 'Tipos de serviços retornados com sucesso',
            result: data
        })
    }catch(e){
        res.status(500).json({
            statusCode: 500,
            status: "Internal Server Error",
            message: "Erro ao consultar os dados dos tipos de serviços",
            error: e
        })
    }
})

module.exports = router
