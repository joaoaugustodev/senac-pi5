const express = require('express')
const router = express.Router()
const UserOwner = require('../models/UserOwner')
const response = require('../models/Helpers/ResponseDefault')

router.post('/login', async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(403).json(response.send('failLogin'))
  }

  try {
    const data = await UserOwner.findOne({ email })

    if (password !== data.password) {
      return res
        .status(403)
        .json(response.send('failLogin', null, 'A senha informada está errada.'))
    }

    res.status(200).json(response.send('successLogin', data))
  } catch (e) {
    return res.status(500).json(response.send('errorLogin'))
  }
})

module.exports = router

