const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const typeservice = require('../models/TypeServices')
const UserJobber = require('../models/UserJobber')
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
    } else {
        res.status(500).json({
            statusCode: 500,
            status: 'Error',
            message: 'Dados inválidos'
        })
    }
})

router.get('/:id', verifyToken, async (req, res) => {

    if (!req.token) {
        return res.status(401).json(response.send('error401', null, 'O usuário não está autenticado.'))
    }

    const jobberId = req.params.id
    const jobberReturn = await UserJobber.findOne({'_id': req.params.id})

    if(jobberReturn != null){
        try{
            const data = await typeservice.find({'idUserJobber': req.params.id});
            res.status(200).json({
                statusCode: 200,
                status: "OK",
                message: 'Tipos de serviços para o usuário solicitado retornados com sucesso',
                result: data
            })
        }catch(e){
            res.status(500).json({
                statusCode: 500,
                status: "Internal Server Error",
                message: "Erro ao consultar os dados dos tipos de serviços do usuário",
                error: e
            })
        }
    }else{
        res.status(400).json({
            statusCode: 400,
            status: "Inconsistent request",
            message: 'Request para um usuário que não existe',
            result: null
        }) 
    }
})

router.delete('/hack/:id', (req, res) => {
    typeservice.deleteOne({_id: req.params.id }, (err, data) => {
      if (err) return res.status(500).json(response.send('error500'))
      res.status(200).json(response.send('removed', data, 'TypeService Removido REALMENTE com sucesso'))
    })
  })

module.exports = router
