const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
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
