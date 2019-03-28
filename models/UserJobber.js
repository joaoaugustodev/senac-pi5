const { Schema, model } = require('mongoose')
const jwt = require('jsonwebtoken')
const Comments = require('./Comments')

require('dotenv').config()

const UserJobberSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Nome é obrigatório']
  },
  email: {
    type: String,
    required: [true, 'E-mail obrigatório']
  },
  password: {
    type: String,
    required: [true, 'A senha não foi informado']
  },
  description: {
    type: String
  },
  rate: {
    type: Number
  },
  qtdCredit: {
    type: Number,
    default: 0
  },
  accountNumber: {
    type: String,
    required: [true, 'Número da conta é obrigatAnimalório']
  },
  digit: {
    type: String,
    required: [true, 'Digito da conta é obrigatório']
  },
  agency: {
    type: String,
    required: [true, 'Agência da conta é obrigatória']
  },
  birthday: {
    type: Date,
    default: Date.now()
  },
  address: {
    type: String,
    required: [true, 'Endereço é obrigatório']
  },
  lat: {
    type: Number,
    required: [true, 'Latitude é obrigatório']
  },
  lng: {
    type: Number,
    required: [true, 'Longitude é obrigatório']
  },
  phone: {
    type: String
  },
  gender: {
    type: String,
    default: 'N/A'
  },
  photo: {
    type: String
  },
  capaPhoto: {
    type: String
  },
  comments: [Comments],
})

UserSchema.pre('save', function (next) {
  if (!this.token) {
    this.token = jwt.sign({ name: this.name, type: this.type }, process.env.PASS_TOKEN)
  }

  next()
})

module.exports = model('UserJobber', UserJobber)
