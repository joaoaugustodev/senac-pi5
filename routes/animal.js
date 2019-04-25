const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const animal = require('../models/Animal')
const UserOwner = require('../models/UserOwner')
const response = require('../models/Helpers/ResponseDefault')
const jwt = require('jsonwebtoken')
const verifyToken = require('../middleware/verifyJwt')
const upload = require('../middleware/upload')
const helperEdit = require('./helper/helperEdit')
const uploadPhotos = upload.fields([{ name: 'photo', maxCount: 1 }, { name: 'capaPhoto', maxCount: 1 }])

router.post('/create', uploadPhotos, verifyToken, async (req, res) => {
    if (!req.token) {
      return res.status(401).json(response.send('error401', null, 'O usuário não está autenticado.'))
    }
    const data = new animal(helperEdit(req.body, req.files))
    const ownerReturn = await UserOwner.findOne({'_id': data.idOwner})

    if(ownerReturn != null){
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
    }else{
      res.status(400).json({
        statusCode: 400,
        status: "Inconsistent request",
        message: 'Request para um tipo de usuário que não existe',
        result: null
      })
    }

})

router.get('/:id', verifyToken, async (req, res) => {
  
  if (!req.token) {
    return res.status(401).json(response.send('error401', null, 'O usuário não está autenticado.'))
  }
  const animalId = req.params.id
  try{
    const data = await animal.find({'_id': animalId});
    res.status(200).json({
        statusCode: 200,
        status: "OK",
        message: 'Animal retornado com sucesso',
        result: data
    })
  }catch(e){
    res.status(500).json({
        statusCode: 500,
        status: "Internal Server Error",
        message: "Erro ao consultar os dados do animal solicitado",
        error: e
    })
  }
})

router.put('/edit/:id', uploadPhotos, verifyToken, async(req, res) => {
    if (!req.token) {
      return res.status(401).json(response.send('unauthorized', null, 'O usuário não está autenticado.'))
    }

    const hasUser = await animal.findOne({ _id: req.params.id })

    if (!hasUser) {
      return res.status(404).json({
        statusCode: 404,
        status: "Not Found",
        message: 'Animal não encontrado.',
        result: null 
      })
    }

    animal.findOneAndUpdate({'_id': req.params.id}, helperEdit(req.body, req.files), {new: true}, (err, data) => {
      if (err) {
        return res.status(500).json({
          statusCode: 500,
          status: 'error',
          message: 'Não foi possível completar a operação.',
          result: err
        })
      }

      if(data){
        return res.status(200).json({
            statusCode: 200,
            status: "OK",
            message: 'Dados alterados com sucesso!',
            result: data 
        })
      }
  })
})

router.delete('/delete', verifyToken, async(req, res) => {
    if (!req.token) {
      return res.status(401).json(response.send('unauthorized', null, 'O usuário não está autenticado.'))
    }
  
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
        return res.status(404).json({
            statusCode: 404,
            status: "not found",
            message: 'Animal não encontrado.',
            result: null 
          })
    }

})

module.exports = router
