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
    required: true
  },
  date: {
    type: Date,
    default: Date.now()
  },
  photo: {
    type: String
  },
  userName: {
    type: String
  }
})

module.exports = model('Comments', commentsSchema, 'Comments')
