const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const UserOwner = require('../models/UserOwner')
const UserJobber = require('../models/UserJobber')
const comments = require('../models/Comments')
const service = require('../models/Services')
const animal = require('../models/Animal')
const response = require('../models/Helpers/ResponseDefault')
const jwt = require('jsonwebtoken')
const verifyToken = require('../middleware/verifyJwt')
const upload = require('../middleware/upload')
const helperEdit = require('./helper/helperEdit')
const uploadPhotos = upload.fields([{ name: 'photo', maxCount: 1 }, { name: 'capaPhoto', maxCount: 1 }])


router.get('/:id', verifyToken, async (req, res) => {

  if (!req.token) {
    return res.status(401).json(response.send('error401', null, 'Usuário não está autenticado.'))
  }

  try {
    const data = await UserJobber.findOne({ _id: req.params.id })

    if (!data) {
      return res
        .status(404)
        .json(response.send('error404', null, 'Usuário não encontrado.'))
    }

    Array.isArray(data) ? data.forEach(item => item.password = null) : data.password = null

    res
      .status(200)
      .json(response.send('success', data, 'Usuário encontrado com sucesso.'))

  } catch (e) {
    res.status(500).json(response.send('error500'))
  }
})

router.get('/search/for/proximity', verifyToken, async (req, res) => {
  console.log("ENTREI")
  console.log(req.query.lng, req.query.lat, req.query.typeService)
  UserJobber.aggregate([
    {
      $geoNear: {
        near: { type: "Point", coordinates: [ parseFloat(req.query.lat), parseFloat(req.query.lng) ] },
        distanceField: "dist.calculated",
        includeLocs: "dist.location",
        distanceMultiplier: 0.001,
        maxDistance: 100000,
        spherical: true,
        query: { serviceName: req.query.typeService }
      },
    }
  ]).then((results) => {
    console.log("THEN")
    console.log(results)
    let listJobbers = [];
    results.forEach(element => {
      delete element.password;
      listJobbers.push(element);
    });

    res.status(200).json({
      statusCode: 200,
      status: "OK",
      message: 'Consulta realizada com sucesso',
      result: listJobbers
    })
  })
  .catch((err) => {
    console.log("CATCH")
    console.log(err)
    res.status(200).json({
      statusCode: 500,
      status: 'Internal server error',
      message: 'Não foi possível completar a operação',
      error: err
    })
  })
})

router.post('/signin', async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) return res.status(403).json(response.send('failLogin'))

  try {
    const data = await UserJobber.findOne({ email })

    bcrypt.compare(password, data.password, (err, info)  => {
      if (!data || !info) {
        return res
          .status(403)
          .json(response.send('failLogin', null, 'Login inválido.'))
      }

      data.password = null
      res.setHeader('token', jwt.sign({ name: data.name }, process.env.PASS_TOKEN))
      res.status(200).json(response.send('successLogin', data))
    })
  } catch (e) {
    res.status(500).json(response.send('errorLogin'))
  }
})

router.post('/signup', uploadPhotos, async (req, res) => {
  const data = new UserJobber(helperEdit(req.body, req.files))

  if (data && data.email) {
    try {
      const infoUser = await UserJobber.findOne({ email: data.email })

      if (infoUser) {
        return res.status(500).json(response.send('error', null, 'Usuário já existe.'))
      }
    } catch (e) {
      res.status(500).json(response.send('errorLogin'))
    }
  }

  if (!data.validateSync()) {
    const saltRounds = 10;
    bcrypt.hash(data.password, saltRounds, async (err, hash) => {
      data.password = hash;

      await data.save()
      data.password = null
      res.setHeader('token', jwt.sign({ name: data.name }, process.env.PASS_TOKEN))
      return res.status(200).json(response.send('success', data, 'Dados inseridos com sucesso.'))
    });
  }

  res.status(406).json({
    statusCode: 406,
    status: 'error not acceptable',
    message: 'Dados inconsistentes.',
    result: {
      error: Object.keys(error.errors).map(item => error.errors[item].message)
    }
  })
})

router.put('/edit', verifyToken, async (req, res) => {

  if (!req.token) {
    return res.status(401).json(response.send('error401', null, 'O usuário não está autenticado.'))
  }

  let data = req.body;

  UserJobber.findOneAndUpdate({'_id': data._id}, data, {upsert:false}, async(err, doc) => {
    if (!err) {
      //get user
      let user = await UserJobber.findOne({'_id': data._id});

      if(user == null) {
        res.status(404).json({
          statusCode: 404,
          status: 'Not Found',
          message: 'Esse usuário não existe'
        })
      }

      return res.status(200).json({
        statusCode: 200,
        status: "OK",
        message: 'Dados alterados com sucesso!',
        result: user
      })
    }

    res.status(500).json({
      statusCode: 500,
      status: 'error',
      message: 'Não foi possível completar a operação.',
      result: err
    })
  });
})

router.delete('/delete', verifyToken, async (req, res) => {

  if (!req.token) {
    return res.status(401).json(response.send('error401', null, 'O usuário não está autenticado.'))
  }
  
  const userId = req.query.id;

  //get user
  let user = await UserJobber.findOne({'_id': userId});

  if(user == null) {
    res.status(404).json({
      statusCode: 404,
      status: 'Not Found',
      message: 'Esse usuário não existe'
    })
  }

  let data = {
    '_id': userId,
    'active': false
  }

  UserJobber.findOneAndUpdate({'_id': userId}, data, {upsert: true}, async(err, doc) => {
    if (!err) {
      return res.status(200).json({
        statusCode: 200,
        status: "OK",
        message: 'Dados alterados com sucesso!',
        result: true
      })
    }

    res.status(500).json({
      statusCode: 500,
      status: 'error',
      message: 'Não foi possível completar a operação.',
      result: err
    })
  });
})

router.get('/comments/:id', verifyToken, async (req, res) =>{
  if (!req.token) {
    return res.status(401).json(response.send('error401', null, 'O usuário não está autenticado.'))
  }
  const jobberId = req.params.id
  const jobberReturn = await UserJobber.findOne({'_id': req.params.id})

  if(jobberReturn != null){
    try{
      const data = await comments.find({'idUserJobber': jobberId, 'direction': "OJ"});
      if(data.length === 0){
        res.status(200).json({
          statusCode: 200,
          status: "OK",
          message: 'Comentarios retornados com sucesso',
          result: []
        })
      }else{
        let listComments = [];
  
        let cont = 0;
        data.forEach(async element => {
          let uidOwner = element.idUserOwner;
          let owner = await UserOwner.findOne({'_id': uidOwner});
  
          element.photo = owner.photo;
          element.userName = owner.name;
  
          listComments.push(element);
  
          if(cont == data.length - 1) {
            res.status(200).json({
              statusCode: 200,
              status: "OK",
              message: 'Comentarios retornados com sucesso',
              result: listComments
            })
          }
  
          cont++;
        });
      }

    }catch(e){
      res.status(500).json({
          statusCode: 500,
          status: "Internal Server Error",
          message: "Erro ao consultar os comentarios do usuario informado",
          error: e
      })
    }
  }else{
    res.status(400).json({
      statusCode: 400,
      status: "Inconsistent request",
      message: 'Request para um usuario que não existe',
      result: null
    }) 
  }
})

router.get('/services/:id', verifyToken, async (req, res) =>{
  if (!req.token) {
    return res.status(401).json(response.send('error401', null, 'O usuário não está autenticado.'))
  }
  const jobberId = req.params.id
  const jobberReturn = await UserJobber.findOne({'_id': req.params.id})

  if(jobberReturn != null){
    try{
      const data = await service.find({'idUserJobber': jobberId});
      
      if(data.length === 0){
        res.status(200).json({
          statusCode: 200,
          status: "OK",
          message: 'Serviços retornados com sucesso',
          result: []
        })
      }else{
        let listServices = [];
  
        let cont = 0;
        data.forEach(async element => {
          let uidOwner = element.idUserOwner;
          let uidAnimal = element.idAnimal
          let uidJobber = req.params.id

          let owner = await UserOwner.findOne({'_id': uidOwner});
          let userAnimal = await animal.findOne({'_id': uidAnimal});
          let jobber = await UserJobber.findOne({'_id': uidJobber});
          
          let internalLoad = {}

          internalLoad.ownerName = owner.name;
          internalLoad.ownerEmail = owner.email;
          internalLoad.jobberName = jobber.name;
          internalLoad.jobberEmail = jobber.email;
          internalLoad.jobberService = jobber.serviceName;
          internalLoad.jobberValue = jobber.servicePrice;
          internalLoad.animalName = userAnimal.name;
          internalLoad.date = element.date;
          internalLoad.ownerServiceConfirmation = element.ownerServiceConfirmation;
          internalLoad.jobberServiceConfirmation = element.jobberServiceConfirmation
          internalLoad.serviceStatus = element.serviceStatus
  
          listServices.push(internalLoad);
  
          if(cont == data.length - 1) {
            res.status(200).json({
              statusCode: 200,
              status: "OK",
              message: 'Serviços retornados com sucesso',
              result: listServices
            })
          }
  
          cont++;
        });
      }

    }catch(e){
      res.status(500).json({
          statusCode: 500,
          status: "Internal Server Error",
          message: "Erro ao consultar os serviços do jobber informado",
          error: e
      })
    }
  }else{
    res.status(400).json({
      statusCode: 400,
      status: "Inconsistent request",
      message: 'Request para um usuário que não existe',
      result: null
    }) 
  }
})

module.exports = router
