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

router.delete('/delete/:id', verifyToken, (req, res) => {
    if (!req.token) {
      return res.status(401).json(response.send('error401', null, 'O usuário não está autenticado.'))
    }
  
    animal.findOneAndUpdate(req.params._id, { status: false }, {new: true}, (err, data) => {
      if (err) return res.status(500).json(response.send('error500'))
      data.save()
      res.status(200).json(response.send('removed', data, 'Animal removido com sucesso.'))
    })
})

module.exports = router

//necessário verificar se o owner existe