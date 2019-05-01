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
        return res.status(401).json(response.send('error401', null, 'O usuário não está autenticado.'))
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
            if(data.direction === "JO"){
                //Necessário fazer o update da nota do owner
                const resultado = comments.aggregate([
                    {$match:{
                        direction: "JO",
                        idUserOwner: data.idUserOwner
                    }},
                    {$group:{
                        _id: null,
                        total: {$sum: "$rate"}
                        }
                    }
                ])
                //const valorCalculado = total/quantidadeDeComentarios
                //UserOwner.findOneAndUpdate({'_id': data.idUserOwner}, { rate: valorCalculado }, {new: true})

            }else{
                //Necessário fazer o update da nota do jobber
            }

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

module.exports = router