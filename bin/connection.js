const mongoose = require('mongoose')

mongoose.connect(`mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/mypetpass`, {useNewUrlParser: true})

module.exports = mongoose
