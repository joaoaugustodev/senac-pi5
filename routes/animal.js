const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const animal = require('../models/Animal')
const response = require('../models/Helpers/ResponseDefault')
const jwt = require('jsonwebtoken')
const verifyToken = require('../middleware/verifyJwt')

router.post('/create', async (req, res) => {
    const data = new animal(req.body)

    if(!data.validateSync()) {
        try {
            let result = await data.save();

            res.status(200).json({
                statusCode: 200,
                status: "OK",
                message: 'Animal criado com sucesso',
                result: result
            })
        } catch(e) {
            res.status(500).json({
                statusCode: 500,
                status: "Internal Server Error",
                message: "Erro ao inserir animal",
                error: e
            })
        }
    }
})

router.put('/edit', async(req, res) => {
    const dataParam = req.body;
    /*if (!req.token) {
      return res.status(401).json(response.send('error401', null, 'O usuário não está autenticado.'))
    }*/
  
    const animalReturn = await animal.findOne({'_id': req.query.id})

    if (animalReturn != null){

        animal.findOneAndUpdate({'_id': req.query.id}, dataParam, {upsert : false}, (err, data) => {
            if (!err) {
                return res.status(200).json({
                    statusCode: 200,
                    status: "OK",
                    message: 'Dados alterados com sucesso!',
                    result: data 
                })
              } else {
                res.status(500).json({
                  statusCode: 500,
                  status: 'error',
                  message: 'Não foi possível completar a operação.',
                  result: err
                })
              }
        })

    }else{
        return res.status(200).json({
            statusCode: 404,
            status: "not found",
            message: 'Animal não encontrado.',
            result: null 
          })
    }

})

router.delete('/delete', async(req, res) => {
    /*if (!req.token) {
      return res.status(401).json(response.send('error401', null, 'O usuário não está autenticado.'))
    }*/
  
    const animalReturn = await animal.findOne({'_id': req.query.id})

    if (animalReturn != null){

        animal.findOneAndUpdate({'_id': req.query.id}, { status: false }, {new: true}, async(err, data) => {
            if (!err) {
                return res.status(200).json({
                    statusCode: 200,
                    status: "OK",
                    message: 'Dados alterados com sucesso!',
                    result: data 
                })
              } else {
                res.status(500).json({
                  statusCode: 500,
                  status: 'error',
                  message: 'Não foi possível completar a operação.',
                  result: err
                })
              }
        })

    }else{
        return res.status(200).json({
            statusCode: 404,
            status: "not found",
            message: 'Animal não encontrado.',
            result: null 
          })
    }

})

module.exports = router

//necessário verificar se o owner existe