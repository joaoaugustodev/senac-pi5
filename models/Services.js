const { Schmema, model } = require('mongoose')

const servicesSchema = new Schmema({
  idUserOwner: {
    type: Schmema.Types.ObjectId,
    ref: 'UserOwner'
  },
  idUserJobber: {
    type: Schmema.Types.ObjectId,
    ref: 'UserJobber'
  }
})

module.exports = model('Services', servicesSchema)
