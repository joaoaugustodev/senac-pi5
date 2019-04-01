const { Schema, model } = require('mongoose')

const typeServicesSchema = new Schema({
  name: {
    type: String,
    required: true,
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
    small: 1,
    medium: 1.25,
    large: 1.5
  }
})

module.exports = model('TypeServices', typeServicesSchema, 'TypeServices')
