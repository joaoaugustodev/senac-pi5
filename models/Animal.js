const { Schema, model } = require('mongoose')

const animalSchema = new Schema({
  idOwner: {
    type: Schema.Types.ObjectId,
    ref: 'UserOwner'
  },
  status: {
    type: Boolean,
    default: true
  },
  name: {
    type: String,
    required: true
  },
  animalRegister: {
    type: String
  },
  description: {
    type: String
  },
  photo: {
    type: String
  },
  breed: {
    type: String,
    required: true
  },
  weight: {
    type: Number
  },
  animalSize: {
    type: String,
    required: true
  },
  animalType: {
    type: String,
    required: true
  }
})

module.exports = model('Animal', animalSchema, 'Animal')
