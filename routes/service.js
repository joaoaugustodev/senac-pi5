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
    let dateNow = Date.now();

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
        res.status(406).json({
            statusCode: 406,
            status: 'error',
            message: 'não é possível modificar um serviço cancelado'
        })
    }

    //caso o status do serviço seja 'pago', retorna um erro informando que não é possível modificar um serviço pago
    if(oldService.serviceStatus === 'pago') {
        res.status(406).json({
            statusCode: 406,
            status: 'error',
            message: 'não é possível modificar um serviço pago'
        })
    }

    //Caso tenha alterações no ownerServiceConfirmation verifica se é para true
    if(
        (data.ownerServiceConfirmation !== undefined) &&
        (data.ownerServiceConfirmation == false && data.ownerServiceConfirmation !== oldService.ownerServiceConfirmation)
    ) {
        res.status(406).json({
            statusCode: 406,
            status: 'error not acceptable',
            message: 'Você só pode alterar o status do owner para verdadeiro.'
        })
    }

    //Caso tenha alterações no jobberServiceConfirmation verifica se é para true
    if(
        (data.jobberServiceConfirmation !== undefined) &&
        (data.jobberServiceConfirmation == false && data.jobberServiceConfirmation !== oldService.jobberServiceConfirmation)
    ) {
        res.status(406).json({
            statusCode: 406,
            status: 'error not acceptable',
            message: 'Você só pode alterar o status do jobber para verdadeiro.'
        })
    }

    //Não permite que altere o status do jobber e do owner de uma vez
    if(
        (data.jobberServiceConfirmation !== undefined && (data.jobberServiceConfirmation !== oldService.jobberServiceConfirmation)) && 
        (data.ownerServiceConfirmation !== undefined && (data.ownerServiceConfirmation !== oldService.ownerServiceConfirmation))
    ) {
        res.status(406).json({
            statusCode: 406,
            status: 'error not acceptable',
            message: 'Não é possível alterar ambos os status de uma vez.'
        })
    }

    //===================================================================================================

    if(data.serviceStatus == 'cancelado') {
        //update no serviceStatus para cancelado
        await service.findOneAndUpdate({_id: data._id}, { serviceStatus: 'cancelado' }, {upsert:false}, async (err, doc) => {
            let newService = await service.findOne({_id: data._id});

            res.status(200).json({
                statusCode: 200,
                status: 'Ok',
                message: 'serviço cancelado com sucesso.',
                result: newService
            })
        })


    } else if(oldService.serviceStatus == 'solicitado') {

        if(oldService.date < dateNow) {
            data.serviceStatus = 'executado';
            await service.findOneAndUpdate({_id: data._id}, data, {upsert:false}, async (err, doc) => {
                let newService = await service.findOne({_id: data._id});

                res.status(200).json({
                    statusCode: 200,
                    status: 'OK',
                    message: 'serviço alterado com sucesso',
                    result: newService
                })
            })
        } else {
            //não é possível alterar o status antes da data de execução
            res.status(406).json({
                statusCode: 406,
                status: 'error',
                message: 'Não é possível fazer alterações no serviço antes de sua execução'
            })
        }


    } else if(oldService.serviceStatus == 'executado') {
        await service.findOneAndUpdate({_id: data._id}, data, {upsert:false}, async (err, doc) => {
            let newService = await service.findOne({_id: data._id});

            if(newService.ownerServiceConfirmation == true && newService.jobberServiceConfirmation == true) {
                
                newService.serviceStatus = 'pago';
                await service.findOneAndUpdate({_id: data._id}, newService, {upsert:false}, async (err, doc) => {
                    res.status(200).json({
                        statusCode: 200,
                        status: 'OK',
                        message: 'serviço alterado com sucesso',
                        result: newService
                    })
                })
            } else {
                res.status(200).json({
                    statusCode: 200,
                    status: 'OK',
                    message: 'serviço alterado com sucesso',
                    result: newService
                })
            }
        })
    }
});

module.exports = router
