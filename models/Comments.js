const { Schema, model } = require('mongoose')

const commentsSchema = new Schema({
  idUserJobber: {
    type: Schema.Types.ObjectId,
    ref: 'UserJobber'
  },
  idUserOwner: {
    type: Schema.Types.ObjectId,
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

module.exports = model('Comments', commentsSchema, 'Comments')
