const { Schmema, model } = require('mongoose')

const commentsSchema = new Schmema({
  idUserJobber: {
    type: Schmema.Types.ObjectId,
    ref: 'UserOwner'
  },
  idUserOwner: {
    type: Schmema.Types.ObjectId,
    ref: 'UserOwner'
  },
  comment: {
    type: String,
    required: true
  },
  direction: {
    type: String,
    required: true
  },
  rate: {
    type: Number,
  },
  date: {
    type: Date,
    default: Date.now()
  }
})

module.exports = model('Comments', commentsSchema)
