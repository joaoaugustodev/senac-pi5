const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const UserJobber = require('../models/UserJobber')
const Comments = require('../models/Comments')
const response = require('../models/Helpers/ResponseDefault')
const jwt = require('jsonwebtoken')

router.get('/', async (req, res) => {
    console.log("ENTREI")
    const data = await UserJobber.find();
    const comment = await Comments.find();
    res.status(200).json({jobbers: data, comments: comment});
}) 

router.post('/signin', async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) return res.status(403).json(response.send('failLogin'))

  try {
    const data = await UserJobber.findOne({ email })

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
  } catch (e) {
    res.status(500).json(response.send('errorLogin'))
  }
})

router.post('/signup', async (req, res) => {
  const data = new UserJobber(req.body)

  if (data && data.email) {
    try {
      const infoUser = await UserJobber.findOne({ email: data.email })

      if (infoUser) {
        return res.status(500).json(response.send('error', null, 'Usuário já existe.'))
      }
    } catch (e) {
      res.status(500).json(response.send('errorLogin'))
    }
  }

  if (!data.validateSync()) {
    const saltRounds = 10;
    bcrypt.hash(data.password, saltRounds, async (err, hash) => {
      data.password = hash;

      await data.save()
      data.password = null
      res.setHeader('token', jwt.sign({ name: data.name }, process.env.PASS_TOKEN))
      return res.status(200).json(response.send('success', data, 'Dados inseridos com sucesso.'))
    });  
  }

  res.status(406).json({
    statusCode: 406,
    status: 'error not acceptable',
    message: 'Dados inconsistentes.',
    result: {
      error: Object.keys(error.errors).map(item => error.errors[item].message)
    }
  })
})

router.put('/edit', async (req, res) => {
  let user = req.body;

  try {
    const data = await UserJobber.updateMany({_id: user._id}, user);
    
    res.status(200).json({
      statusCode: 200,
      status: 'OK',
      message: 'Dados atualizados com sucesso!',
      result: data
    })
  } catch(e) {
    res.status(200).json({
      statusCode: 500,
      status: "Internal Server Error",
      message: 'Não foi possível completar a operação',
      result: e
    })
  }
})

router.delete('/delete', async (req, res) => {
  const userId = req.query.id;
  
  try {
    const data = await UserJobber.deleteMany({_id: userId});
    
    res.status(200).json({
      statusCode: 200,
      status: "OK",
      message: 'Usuário removido com sucesso!',
      result: data
    })
  } catch(e) {
    res.status(500).json({
      statusCode: 500,
      status: 'Internal Server Error',
      message: 'Erro ao remover usuário',
      result: e
    })
  }
})

module.exports = router