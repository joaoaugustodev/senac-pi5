const mongoose = require('mongoose')

mongoose.connect(`mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/mypetpass`, {useNewUrlParser: true})
// mongoose.connect(`mongodb://localhost:27017/mypetpass`, {useNewUrlParser: true})

module.exports = mongoose
