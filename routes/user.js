const express = require('express')
const router = express.Router()
const UserOwner = require('../models/UserOwner')
const response = require('../models/Helpers/ResponseDefault')

router.post('/login', (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(403).json(response.send('failLogin'))
  }

  UserOwner.findOne({ email }, (err, data) => {
    if (err) {
      return res.status(500).json(response.send('errorLogin'))
    }

    if (password !== data.password) {
      return res
        .status(403)
        .json(response.send('failLogin', null, 'A senha informada está errada.'))
    }

    res.status(200).json(response.send('successLogin', data))
  })
})

module.exports = router

