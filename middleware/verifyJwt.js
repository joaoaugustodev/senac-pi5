const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
  const token = req.getHeader('Authorization').split(' ')[1]

  if (!token) {
    req.token = false
    next()
  }

  jwt.verify(token, process.env.PASS_TOKEN, function(err, decoded) {
    if (err) {
      throw err
    }

    req.token = true
    req.infoToken = decoded
    next()
  })
}
