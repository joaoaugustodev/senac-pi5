const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const UserOwner = require('../models/UserOwner')
const animal = require('../models/Animal')
const comments = require('../models/Comments')
const response = require('../models/Helpers/ResponseDefault')
const jwt = require('jsonwebtoken')
const verifyToken = require('../middleware/verifyJwt')
const upload = require('../middleware/upload')
const helperEdit = require('./helper/helperEdit')
const uploadPhotos = upload.fields([{ name: 'photo', maxCount: 1 }, { name: 'capaPhoto', maxCount: 1 }])

router.get('/:id', verifyToken, async (req, res) => {
  if (!req.token) {
    return res.status(401).json(response.send('error401', null, 'Usuário não está autenticado.'))
  }

  try {
    const data = await UserOwner.findOne({ _id: req.params.id })

    if (!data) {
      return res
        .status(404)
        .json(response.send('error404', null, 'Usuário não encontrado.'))
    }

    Array.isArray(data) ? data.forEach(item => item.password = null) : data.password = null

    res
      .status(200)
      .json(response.send('success', data, 'Usuário encontrado com sucesso.'))

  } catch (e) {
    res.status(500).json(response.send('error500'))
  }
})

router.post('/signin', async (req, res) => {
  const { email, password } = req.body

  try {
    const data = await UserOwner.findOne({ email })

    if(data == null){
      return res
            .status(403)
            .json(response.send('failLogin', null, 'Login inválido.'))
    }else{
      UserOwner.findOneAndUpdate({email}, { active: true }, {new: true}, (err, data) => {
        if (err) return res.status(500).json(response.send('error500'))
        data.save()
      })
  
      bcrypt.compare(password, data.password, (err, info)  => {
        if (!data || !info) {
          return res
            .status(403)
            .json(response.send('failLogin', null, 'Login inválido.'))
        }
  
        data.password = null
        res.setHeader('token', jwt.sign({ name: data.name }, process.env.PASS_TOKEN))
        res.status(200).json(response.send('successLogin', data))
      })
    }

  } catch (e) {
    res.status(500).json(response.send('errorLogin'))
  }
})

router.post('/signup', uploadPhotos, async (req, res) => {
  const data = new UserOwner(helperEdit(req.body, req.files))

  if (data && data.email) {
    try {
      const infoUser = await UserOwner.findOne({ email: data.email })

      if (infoUser) {
        return res.status(403).json(response.send('error', null, 'Usuário já existe.'))
      }
    } catch (e) {
      res.status(500).json(response.send('errorLogin'))
    }
  }

  if (!data.validateSync()) {
    data.save()
    res.setHeader('token', jwt.sign({ name: data.name }, process.env.PASS_TOKEN))
    return res.status(200).json(response.send('success', data, 'Dados inseridos com sucesso.'))
  }

  res.status(406).json({
    statusCode: 406,
    status: 'error not acceptable',
    message: 'Dados inconsistentes.',
    result: null
  })
})

router.put('/edit/:id', uploadPhotos, verifyToken, (req, res) => {
  if (!req.token) {
    return res.status(401).json(response.send('error401', null, 'Usuário não está autenticado.'))
  }

  UserOwner.findOneAndUpdate(req.params._id, helperEdit(req.body, req.files), {new: true}, (err, data) => {
    if (err) return res.status(500).json(response.send('error500'))
    data.save()
    res.status(200).json(response.send('success', data, 'Dados atualizados com sucesso.'))
  })
})

router.delete('/delete/:id', uploadPhotos, verifyToken, (req, res) => {
  if (!req.token) {
    return res.status(401).json(response.send('error401', null, 'Usuário não está autenticado.'))
  }

  UserOwner.findOneAndUpdate(req.params._id, { active: false }, {new: true}, (err, data) => {
    if (err) return res.status(500).json(response.send('error500'))
    data.save()
    res.status(200).json(response.send('removed', data, 'Usuario Removido com sucesso'))
  })
})

router.delete('/hack/:id', (req, res) => {
  UserOwner.deleteOne({_id: req.params.id }, (err, data) => {
    if (err) return res.status(500).json(response.send('error500'))
    res.status(200).json(response.send('removed', data, 'Usuario Removido REALMENTE com sucesso'))
  })
})

router.put('/credit/:id/:value', uploadPhotos, verifyToken, async (req, res) => {
  if (!req.token) {
    return res.status(401).json(response.send('error401', null, 'O usuário não está autenticado.'))
  }

  const userId = req.params.id
  const creditValue = (parseInt(req.params.value) > 0) ? parseInt(req.params.value) : 0 
  let updatedCredit = 0

  try{
    const user = await UserOwner.findOne({'_id': userId});
    updatedCredit = parseInt(user.qtdCredit) + parseInt(creditValue)

    console.log('credit:', user)

  }catch(err){
    res.status(500).json({
      statusCode: 500,
      status: "Internal Server Error",
      message: "Erro ao consultar os dados do usuário",
      error: err
    })
  }


  UserOwner.findOneAndUpdate({'_id': userId}, { qtdCredit: updatedCredit }, {new: true}, async(err, data) => {
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
})

router.get('/animals/:id', verifyToken, async (req, res) =>{
  if (!req.token) {
    return res.status(401).json(response.send('error401', null, 'O usuário não está autenticado.'))
  }
  const ownerId = req.params.id
  const ownerReturn = await UserOwner.findOne({'_id': req.params.id})

  if(ownerReturn != null){
    try{
      const data = await animal.find({'idOwner': ownerId, 'status': true});
      res.status(200).json({
          statusCode: 200,
          status: "OK",
          message: 'Animais retornados com sucesso',
          result: data
      })
    }catch(e){
      res.status(500).json({
          statusCode: 500,
          status: "Internal Server Error",
          message: "Erro ao consultar os animais do dono informado",
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

router.get('/comments/:id', verifyToken, async (req, res) =>{
  if (!req.token) {
    return res.status(401).json(response.send('error401', null, 'O usuário não está autenticado.'))
  }
  const ownerId = req.params.id
  const ownerReturn = await UserOwner.findOne({'_id': req.params.id})

  if(ownerReturn != null){
    try{
      const data = await comments.find({'idUserOwner': ownerId, 'direction': "JO"});
      res.status(200).json({
          statusCode: 200,
          status: "OK",
          message: 'Comentarios retornados com sucesso',
          result: data
      })
    }catch(e){
      res.status(500).json({
          statusCode: 500,
          status: "Internal Server Error",
          message: "Erro ao consultar os comentarios do dono informado",
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

module.exports = router

