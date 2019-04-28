const { Schema, model } = require('mongoose')

const typeServicesSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  idUserJobber: {
    type: Schema.Types.ObjectId,
    ref: 'UserJobber'
  },
  description: {
    type: String,
    required: true
  },
  value: {
    type: Number,
    required: true
  },
  sizes: {
    small: {
      type: Number,
      default: 1,
    },
    medium: {
      type: Number,
      default: 1.25
    },
    large: {
      type: Number,
      default: 1.5
    }
  }
})

module.exports = model('TypeServices', typeServicesSchema, 'TypeServices')
