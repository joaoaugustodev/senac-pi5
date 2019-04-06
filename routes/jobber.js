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
      // const comments = await Comments.find({idUserJobber: data._id});
      // console.log("COMMENTS =======>")
      // console.log(comments)
      // data.comments = comments;

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

module.exports = router