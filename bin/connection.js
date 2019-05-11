const mongoose = require('mongoose')

mongoose.connect(`mongodb://localhost:27017/mypetpass`, {useNewUrlParser: true})
//mongoose.connect(`mongodb+srv://mypetpass:segredodopetpass@cluster0-hygow.mongodb.net/test`, {useNewUrlParser: true})

module.exports = mongoose
