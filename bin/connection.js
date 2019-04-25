const mongoose = require('mongoose')

mongoose.connect(`mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/mypetpass`, {useNewUrlParser: true})
//mongoose.connect(`mongodb+srv://mypetpass:segredodopetpass@cluster0-hygow.mongodb.net/test`, {useNewUrlParser: true})

module.exports = mongoose
