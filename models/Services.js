const { Schema, model } = require('mongoose')
const Animal = require('./Animal')
const UserOwner = require('./UserOwner')
const UserJobber = require('./UserJobber')
const TypeServices = require('./TypeServices')

const servicesSchema = new Schema({
  idUserOwner: {
    type: Schema.Types.ObjectId,
    ref: 'UserOwner'
  },
  idUserJobber: {
    type: Schema.Types.ObjectId,
    ref: 'UserJobber'
  },
  idTypeService: {
    type: Schema.Types.ObjectId,
    ref: 'TypeServices'
  },
  idAnimal: {
    type: Schema.Types.ObjectId,
    ref: 'Animal'
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
    default: 'solicitado'
  }
})

module.exports = model('Services', servicesSchema)
