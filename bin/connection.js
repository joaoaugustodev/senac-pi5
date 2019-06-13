const mongoose = require('mongoose')

mongoose.connect(`mongodb://localhost:27017/mypetpass`, {useNewUrlParser: true})
// mongoose.connect(`mongodb+srv://adrianotameouvindo:segredodopetpass@cluster-mypetpass-khguj.mongodb.net/test?retryWrites=true&w=majority`, {useNewUrlParser: true})

module.exports = mongoose


// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiSm9iYmVyIEJhbmhvIDAxIiwiaWF0IjoxNTYwMjA5NDg4fQ.s1I3kJrZIFD9baVU-j_RayrwxMwkHdTFpyiDz3nRzAE
