const { Schema, model } = require('mongoose')
const Animal = require('./Animal')
const UserOwner = require('./UserOwner')
const UserJobber = require('./UserJobber')
const TypeServices = require('./TypeServices')

const servicesSchema = new Schema({
  idUserOwner: {
    type: Schema.Types.ObjectId,
    ref: 'UserOwner',
    required: true
  },
  idUserJobber: {
    type: Schema.Types.ObjectId,
    ref: 'UserJobber',
    required: true
  },
  idTypeService: {
    type: Schema.Types.ObjectId,
    ref: 'TypeServices',
    required: true
  },
  idAnimal: {
    type: Schema.Types.ObjectId,
    ref: 'Animal',
    required: true
  },
  date: {
    type: Date,
    default: Date.now()
  },
  ownerServiceConfirmation: {
    type: Boolean,
    default: false
  },
  jobberServiceConfirmation: {
    type: Boolean,
    default: false
  },
  serviceStatus: {
    type: String,
    default: 'solicitado' //solicitado - cancelado - executado
  }
})

module.exports = model('Services', servicesSchema)
