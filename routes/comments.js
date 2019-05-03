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
    let data = req.body;

    comments.findOneAndUpdate({'_id': req.params.id}, data, {upsert:false}, async(err, returnData) => {
        if (err) {
            return res.status(500).json({
            statusCode: 500,
            status: 'error',
            message: 'Não foi possível completar a operação.',
            result: err
            })
        }

        let comment = await comments.findOne({'_id': req.params.id});

        //Fazer o update da nota aqui

        if(comment.direction === "OJ"){
            //Necessário fazer o update da nota do owner

            const resultadoQtd = await comments.count({direction:"OJ",idUserJobber: comment.idUserJobber})

            const resultadoSum = await comments.aggregate([
                {$match:{
                    direction: "OJ",
                    idUserJobber: comment.idUserJobber
                }},
                {$group:{
                    _id: null,
                    total: {$sum: "$rate"}
                    }
                }
            ])

            const valorCalculado = Math.round(Number(resultadoSum[0].total)/Number(resultadoQtd))
            UserJobber.findOneAndUpdate({'_id': comment.idUserJobber}, { rate: valorCalculado }, {upsert: true})

        }else{
            const resultadoQtd = await comments.count({direction:"JO",idUserOwner: comment.idUserOwner})
            console.log(resultadoQtd)
        }

        if(comment == null) {
            res.status(404).json({
              statusCode: 404,
              status: 'Not Found',
              message: 'Esse comentario nao existe'
            })
        }
    
        return res.status(200).json({
            statusCode: 200,
            status: "OK",
            message: 'Dados alterados com sucesso!',
            result: comment 
        })
    })
})

module.exports = router