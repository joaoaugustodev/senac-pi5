const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
  if (!req.headers.hasOwnProperty('authorization') || !req.headers.authorization) {
    return res.status(403).json(res.send('error', null, 'Token não enviado.'))
  }

  const token = req.headers.authorization.split(' ')[1]

  if (!token) {
    req.token = false
    next()
  }

  jwt.verify(token, process.env.PASS_TOKEN, function(err, decoded) {
    if (err) {
      req.token = false
      next()
    }

    req.token = true
    req.infoToken = decoded
    next()
  })
}
