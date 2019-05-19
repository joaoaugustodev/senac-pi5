const { Schema, model } = require('mongoose')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const Comments = require('./Comments')
const TypeServices = require('./TypeServices')

const GeoSchema = new Schema({
  type: {
      type: String,
      default: "Point"
  },
  coordinates: {
      type: [Number],
      index: "2dsphere"
  }
})

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
  active: {
    type: Boolean,
    default: true
  },
  description: {
    type: String
  },
  rate: {
    type: Number,
    default: 0
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
  bankCode:{
    type: String,
    required: [true, 'O código do banco é obrigatório']
  },
  birthday: {
    type: Date,
    required: [true, 'A data de aniversário é obrigatória']
  },
  
  geometry: GeoSchema,

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
  slidePhoto: {
    type: String
  },
  weekDays:{
    sunday: {
      type: Boolean,
      required: true,
    },
    monday: {
      type: Boolean,
      required: true,
    },
    tuesday: {
      type: Boolean,
      required: true,
    },
    wednesday: {
      type: Boolean,
      required: true,
    },
    thursday: {
      type: Boolean,
      required: true,
    },
    friday: {
      type: Boolean,
      required: true,
    },
    saturday: {
      type: Boolean,
      required: true,
    },
  },
  startTime:{
    type: Number,
    required: [true, 'O horário inicial é obrigatório.']
  },
  endTime:{
    type: Number,
    required: [true, 'O horário final é obrigatório.']
  },
  comments: {
    type: Schema.Types.ObjectId,
    ref: 'Comments'
  },
  typeServices: {
    type: Schema.Types.ObjectId,
    ref: 'TypeServices'
  }
})

UserJobberSchema.pre('save', function (next) {
  if (!this.token) {
    this.token = jwt.sign({ name: this.name, type: this.type }, process.env.PASS_TOKEN)
  }

  next()
})

module.exports = model('UserJobber', UserJobberSchema, 'UserJobber')
