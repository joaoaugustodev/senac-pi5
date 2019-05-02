const express = require('express')
const router = express.Router()
const comments = require('../models/Comments')
const UserOwner = require('../models/UserOwner')
const UserJobber = require('../models/UserJobber')
const response = require('../models/Helpers/ResponseDefault')
const jwt = require('jsonwebtoken')
const verifyToken = require('../middleware/verifyJwt')

router.get("/", async (req, res) => {
    const data = await comments.find();
    res.json(data)
})

router.post('/create', verifyToken, async (req, res) => {

    if (!req.token) {
        return res.status(401).json(response.send('unauthorized', null, 'O usuário não está autenticado.'))
    }

    const data = new comments(req.body)
    const commentReturn = await comments.findOne({'idUserJobber': data.idUserJobber, 'idUserOwner': data.idUserOwner, 'direction': data.direction})

    if(commentReturn != null){
        return res.status(400).json({
            statusCode: 400,
            status: "Inconsistent request",
            message: 'Já existe comentário deste usuário',
            result: null
        }) 
    }else{
        if(!data.validateSync()) {
            
            try {
                let result = await data.save();
                
                if(data.direction === "OJ"){
                    //Necessário fazer o update da nota do owner

                    /*const resultadoQtd = await comments.count({direction:"OJ",idUserOwner:data.idUserJobber})
                    console.log(resultadoQtd)

                    //=========AGREGATE AINDA NAO ESTA RETORNANDO OQUE EU QUERO==========
                    const resultadoSum = await comments.aggregate([
                        {$match:{
                            direction: "OJ",
                            idUserJobber: data.idUserJobber
                        }},
                        {$group:{
                            _id: null,
                            total: {$sum: "$rate"}
                            }
                        }
                    ])
                    console.log(resultadoSum)*/

                    //const valorCalculado = resultadoSum/resultadoQtd
                    //UserOwner.findOneAndUpdate({'_id': data.idUserOwner}, { rate: valorCalculado }, {new: true})
    
                }else{
                    //Necessário fazer o update da nota do jobber
                }

                return res.status(200).json({
                    statusCode: 200,
                    status: "OK",
                    message: 'Comentário criado com sucesso',
                    result: result
                })
            } catch(e) {
                return res.status(500).json({
                    statusCode: 500,
                    status: "Internal Server Error",
                    message: "Erro ao inserir o comentário",
                    error: e
                })
            }
        }
    }
})

router.put('/edit/:id', verifyToken, async(req, res) => {
    if (!req.token) {
      return res.status(401).json(response.send('unauthorized', null, 'O usuário não está autenticado.'))
    }
    const editData = new comments(req.body)
    const hasComment = await comments.findOne({ _id: req.params.id })
    const hasOwner = await comments.findOne({ idUserOwner: editData.idUserOwner })
    const hasJobber = await comments.findOne({ idUserJobber: editData.idUserJobber })

    if (!hasComment || !hasOwner || !hasJ) {
      return res.status(404).json({
        statusCode: 404,
        status: "Not Found",
        message: 'Comentario ou usuarios não encontrados.',
        result: null 
      })
    }

    comments.findOneAndUpdate({'_id': req.params.id},{$set: editData}, (err, data) => {
        if (err) {
            return res.status(500).json({
            statusCode: 500,
            status: 'error',
            message: 'Não foi possível completar a operação.',
            result: err
            })
        }
        data.save()
        return res.status(200).json({
            statusCode: 200,
            status: "OK",
            message: 'Dados alterados com sucesso!',
            result: data 
        })
    })
})

module.exports = router