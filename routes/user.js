const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const UserOwner = require('../models/UserOwner')
const response = require('../models/Helpers/ResponseDefault')
const jwt = require('jsonwebtoken')
const verifyToken = require('../middleware/verifyJwt')

router.get('/oi', async (req, res) => {
  const data = await UserOwner.find();
  res.status(200).json(data);
})

router.post('/signin', async (req, res) => {
  const { email, password } = req.body

  try {
    const data = await UserOwner.findOne({ email })

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
  const data = new UserOwner(req.body)

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
    result: {
      error: Object.keys(error.errors).map(item => error.errors[item].message)
    }
  })
})

router.put('/edit/:id', verifyToken, (req, res) => {
  if (!req.token) {
    return res
      .status(401)
      .json({
        statusCode: 401, status: 'error request unauthorized', message: 'O usuário não está autenticado.', result: null
      })
  }

  UserOwner.findOneAndUpdate(req.params._id, req.body, { new: false }, (err, data) => {
    if (err) {
      return res.status(500).json(response.send('error500'))
    }

    res.status(200).json(response.send('success', data, 'Dados atualizados com sucesso.'))
  })
})

module.exports = router

