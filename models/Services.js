const { Schmema, model } = require('mongoose')

const servicesSchema = new Schmema({
  idUserOwner: {
    type: Schmema.Types.ObjectId,
    ref: 'UserOwner'
  },
  idUserJobber: {
    type: Schmema.Types.ObjectId,
    ref: 'UserJobber'
  },
  idTypeService: {
    type: Schmema.Types.ObjectId,
    ref: 'TypeService'
  },
  idAnimal: {
    type: Schmema.Types.ObjectId,
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
    required: true
  }
})

module.exports = model('Services', servicesSchema)
