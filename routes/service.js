const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const service = require('../models/Services')
const response = require('../models/Helpers/ResponseDefault')
const jwt = require('jsonwebtoken')
const verifyToken = require('../middleware/verifyJwt')

router.post('/create', verifyToken, async (req, res) => {
    if (!req.token) {
        return res.status(401).json(response.send('error401', null, 'O usuário não está autenticado.'))
    }

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
    } else {
        res.status(500).json({
            statusCode: 500,
            status: 'Error',
            message: 'Dados inválidos'
        })
    }
})



router.put('/edit', verifyToken, async (req, res) => {
    if (!req.token) {
        return res.status(401).json(response.send('error401', null, 'O usuário não está autenticado.'))
    }

    let data = req.body;

    let oldService = await service.findOne({_id: data._id});

    //Caso o serviço não exista retorna um 404, informando que o serviço não existe
    if(oldService == null) {
        res.status(404).json({
            statusCode: 404,
            status: 'not found',
            message: 'Serviço inexistente',
        })
    }

    //caso o status do serviço seja 'cancelado', retorna um erro informando que não é possível modificar um serviço cancelado
    if(oldService.serviceStatus === 'cancelado') {
        res.status(500).json({
            statusCode: 500,
            status: 'error',
            message: 'não é possível modificar um serviço cancelado'
        })
    }

    //Caso tenha alterações no ownerServiceConfirmation verifica se é para true
    if(data.ownerServiceConfirmation !== undefined && data.ownerServiceConfirmation !== 'true') {
        res.status(406).json({
            statusCode: 406,
            status: 'error not acceptable',
            message: 'Você só pode alterar o status do owner para verdadeiro.'
        })
    }

    //Caso tenha alterações no jobberServiceConfirmation verifica se é para true
    if(data.jobberServiceConfirmation !== undefined && data.jobberServiceConfirmation !== 'true') {
        res.status(406).json({
            statusCode: 406,
            status: 'error not acceptable',
            message: 'Você só pode alterar o status do jobber para verdadeiro.'
        })
    }

    //Não permite que altere o status do jobber e do owner de uma vez
    if(data.jobberServiceConfirmation !== undefined && data.ownerServiceConfirmation !== undefined) {
        res.status(406).json({
            statusCode: 406,
            status: 'error not acceptable',
            message: 'Não é possível alterar ambos os status de uma vez.'
        })
    }

    //realiza o update
    service.findOneAndUpdate({_id: data._id}, data, {upsert:false}, async (err, doc) => {
        let newService = await service.findOne({_id: data._id});

        //caso os dois tenham confirmado altera o status do serviço para executado
        if(newService.ownerServiceConfirmation == true && newService.jobberServiceConfirmation == true && newService.serviceStatus !== 'executado') {
            service.findOneAndUpdate({_id: data._id}, {serviceStatus: 'executado'}, {upsert:false}, async (err, doc) => {
                if(!err) {
                    newService.serviceStatus = 'executado';

                    res.status(200).json({
                        statusCode: 200,
                        status: 'OK',
                        message: 'Dados alterados com sucesso',
                        result: newService
                    })
                } else {
                    res.status(500).json({
                        statusCode: 500,
                        status: 'error',
                        message: "Os dados foram alterados mas não foi possível mudar o status para 'executado'",
                        result: err
                    })
                }
            })
        }

        //responde um sucesso, informando que os dados foram alterados.
        if(!err) {
            res.status(200).json({
                statusCode: 200,
                status: 'OK',
                message: 'Dados alterados com sucesso',
                result: newService
            })
        }
        
        //caso tenha dado erro no update
        res.status(500).json({
            statusCode: 500,
            status: 'error',
            message: 'Não foi possível completar a operação.',
            result: err
        })
    })

})

module.exports = router
