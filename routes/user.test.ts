import 'jest'
import * as request from 'supertest'

const endPoint = 'localhost:3000'
//const endPoint = 'https://cc8077f0.ngrok.io'
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiTWFyY2VsbyIsImlhdCI6MTU1NzQ0MDE1Nn0.rILKnhwrVXCgW4vdorpzpBHlLaiJWjBLyDRhSP8rk2s"

const newUser = {
	"name": "Michael Douglas",
	"email": "michaeldouglas@gmail.com",
    "password": "54321",
    "description": "Apenas um teste.",
	"accountNumber": "12121212",
	"digit":"5",
	"agency":"325",
	"bankCode":"125",
	"birthday":"1554564513464",
	"lat": -23.453793, 
    "lng": -46.581368,
    "phone": "1155480000"
}

let userId = ''

const newJobber = {
    "name": "Michael Jobber",
	"email": "michaeljobber@gmail.com",
    "password": "54321",
    "description": "Apenas um teste.",
	"accountNumber": "12121212",
	"digit":"5",
	"agency":"325",
	"bankCode":"125",
	"birthday":"1554564513464",
	"lat": -23.453793, 
    "lng": -46.581368,
    "phone": "1155480000",
    "weekDays": {
        "sunday": "true",
        "monday": "true",
        "tuesday": "true",
        "wednesday": "true",
        "thursday": "false",
        "friday": "false",
        "saturday": "false"
    },
    "startTime": "12",
    "endTime": "18"
}

let jobberId = ''
let typeServiceId = ''
let commentOJId = ''
let commentJOId = ''

const newAnimal = {
    "idOwner": userId,
    "name":"DINAMO cachorro",
    "breed":"Vira-Lata",
    "animalSize":"Medium",
    "animalType":"dog"
}

let animalId = ''

//============================================================================

test('Criação de Owner - retorno 200', ()=>{
    return request(endPoint)
    .post('/user/signup')
    .send(newUser)
    .then(response=>{
        userId = response.body.result._id
        newAnimal.idOwner = response.body.result._id
        expect(response.status).toBe(200)
    }).catch(fail)
})

test('Criação de Jobber - retorno 200', ()=>{
    return request(endPoint)
    .post('/jobber/signup')
    .send(newJobber)
    .then(response=>{
        jobberId = response.body.result._id
        expect(response.status).toBe(200)
    }).catch(fail)
})

test('Criação de TipoServiço - retorno 200', ()=>{
    return request(endPoint)
    .post('/typeservice/create')
    .set('Authorization', 'Bearer ' + token)
    .send({
        "name":"Teste sitter",
        "idUserJobber": jobberId,
        "description":"Cuidador de testes!",
        "value": 150  
    })
    .then(response=>{
        typeServiceId = response.body.result._id
        expect(response.status).toBe(200)
    }).catch(fail)
})

test('Criação de Animal - retorno 200', ()=>{
    return request(endPoint)
    .post('/animal/create')
    .set('Authorization', 'Bearer ' + token)
    .send(newAnimal)
    .then(response=>{
        animalId = response.body.result._id
        expect(response.status).toBe(200)
    }).catch(fail)
})

test('Criação de Comentario OJ - retorno 200', ()=>{
    return request(endPoint)
    .post('/comments/create')
    .set('Authorization', 'Bearer ' + token)
    .send({
        "idUserJobber": jobberId,
        "idUserOwner": userId,
        "comment": "Meu Teste de Owner pra Jobber!",
        "direction": "OJ",
        "rate": 5
    })
    .then(response=>{
        commentOJId = response.body.result._id
        expect(response.status).toBe(200)
    }).catch(fail)
})

test('Criação de Comentario JO - retorno 200', ()=>{
    return request(endPoint)
    .post('/comments/create')
    .set('Authorization', 'Bearer ' + token)
    .send({
        "idUserJobber": jobberId,
        "idUserOwner": userId,
        "comment": "Meu Teste de Jobber pra Owner!",
        "direction": "JO",
        "rate": 5
    })
    .then(response=>{
        commentJOId = response.body.result._id
        expect(response.status).toBe(200)
    }).catch(fail)
})

test('Criação de Serviço - retorno 200', ()=>{
    return request(endPoint)
    .post('/service/create')
    .set('Authorization', 'Bearer ' + token)
    .send({
        
    })
    .then(response=>{
        animalId = response.body.result._id
        expect(response.status).toBe(200)
    }).catch(fail)
})

test('Login de Owner - retorno 200', ()=>{
    return request(endPoint)
    .post('/user/signin')
    .send({
        "email":"michaeldouglas@gmail.com",
        "password":"54321"
    })
    .then(response=>{
        expect(response.status).toBe(200)
    }).catch(fail)
})

test('Login de Jobber - retorno 200', ()=>{
    return request(endPoint)
    .post('/jobber/signin')
    .send({
        "email":"michaeljobber@gmail.com",
        "password":"54321"
    })
    .then(response=>{
        expect(response.status).toBe(200)
    }).catch(fail)
})

/*- NECESSARIO CONCERTAR .... PROVAVEL PROBLEMA NO ID
test('Edição de Owner - retorno 200', ()=>{
    return request(endPoint)
    .put('user/edit/' + userId)
    .set('Authorization', 'Bearer ' + token)
    .send({"name":"Pato Donald Owner do Teste"})
    .then(response=>{
        expect(response.status).toBe(200)
    }).catch(fail)
})

test('Edição de Jobber - retorno 200', ()=>{
    return request(endPoint)
    .put('jobber/edit')
    .set('Authorization', 'Bearer ' + token)
    .send({
        "_id": jobberId,
        "name":"Pato Donald do Teste"
    })
    .then(response=>{
        expect(response.status).toBe(200)
    }).catch(fail)
})

test('Edição de Comentario - retorno 200', ()=>{
    return request(endPoint)
    .put('comments/edit/' + commentJOId)
    .set('Authorization', 'Bearer ' + token)
    .send({"rate": 2})
    .then(response=>{
        expect(response.status).toBe(200)
    }).catch(fail)
})*/

test('Consulta de Owner - retorno 200', ()=>{
    return request(endPoint)
    .get('/user/' + userId)
    .set('Authorization', 'Bearer ' + token)
    .then(response=>{
        expect(response.status).toBe(200)
    }).catch(fail)
})

test('Consulta de Jobber - retorno 200', ()=>{
    return request(endPoint)
    .get('/jobber/' + jobberId)
    .set('Authorization', 'Bearer ' + token)
    .then(response=>{
        expect(response.status).toBe(200)
    }).catch(fail)
})

test('Consulta de Animal - retorno 200', ()=>{
    return request(endPoint)
    .get('/animal/' + animalId)
    .set('Authorization', 'Bearer ' + token)
    .then(response=>{
        expect(response.status).toBe(200)
    }).catch(fail)
})

test('Consulta de TipoServico - retorno 200', ()=>{
    return request(endPoint)
    .get('/typeservice/' + jobberId)
    .set('Authorization', 'Bearer ' + token)
    .then(response=>{
        expect(response.status).toBe(200)
    }).catch(fail)
})

test('Créditos para Owner - retorno 200', ()=>{
    return request(endPoint)
    .put('/user/credit/' + userId + '/40')
    .set('Authorization', 'Bearer ' + token)
    .then(response=>{
        expect(response.status).toBe(200)
    }).catch(fail)
})

test('Edição de Animal - retorno 200', ()=>{
    return request(endPoint)
    .put('/animal/edit/' + animalId)
    .set('Authorization', 'Bearer ' + token)
    .send({"name":"DINAMO"})
    .then(response=>{
        expect(response.status).toBe(200)
    }).catch(fail)
})

test('Animais do Owner - retorno  200', ()=>{
    return request(endPoint)
    .get('/user/animals/5ca8c905725d7b51b271c31e')
    .set('Authorization', 'Bearer ' + token)
    .then(response=>{
        expect(response.status).toBe(200)
    }).catch(fail)
})

test('Comentários do Owner - retorno  200', ()=>{
    return request(endPoint)
    .get('/user/comments/' + userId) 
    .set('Authorization', 'Bearer ' + token)
    .then(response=>{
        expect(response.status).toBe(200)
    }).catch(fail)
})

test('Comentários do Jobber - retorno  200', ()=>{
    return request(endPoint)
    .get('/jobber/comments/' + jobberId) 
    .set('Authorization', 'Bearer ' + token)
    .then(response=>{
        expect(response.status).toBe(200)
    }).catch(fail)
})

test('Delete de Owner - retorno 200', ()=>{
    return request(endPoint)
    .delete('/user/delete/' + userId)
    .set('Authorization', 'Bearer ' + token)
    .then(response=>{
        expect(response.status).toBe(200)
    }).catch(fail)
})

test('Delete de Owner Hack- retorno 200', ()=>{
    return request(endPoint)
    .delete('/user/hack/' + userId)
    .set('Authorization', 'Bearer ' + token)
    .then(response=>{
        expect(response.status).toBe(200)
    }).catch(fail)
})

test('Delete de Jobber - retorno 200', ()=>{
    return request(endPoint)
    .delete('/jobber/delete?id=' + jobberId)
    .set('Authorization', 'Bearer ' + token)
    .then(response=>{
        expect(response.status).toBe(200)
    }).catch(fail)
})
test('Delete de Jobber Hack- retorno 200', ()=>{
    return request(endPoint)
    .delete('/jobber/hack/' + jobberId)
    .then(response=>{
        expect(response.status).toBe(200)
    }).catch(fail)
})

test('Delete de Animal - retorno 200', ()=>{
    return request(endPoint)
    .delete('/animal/delete?id=' + animalId)
    .set('Authorization', 'Bearer ' + token)
    .then(response=>{
        expect(response.status).toBe(200)
    }).catch(fail)
})

test('Delete de Animal Hack- retorno 200', ()=>{
    return request(endPoint)
    .delete('/animal/hack/' + animalId)
    .then(response=>{
        expect(response.status).toBe(200)
    }).catch(fail)
})

test('Delete de TipoServico Hack- retorno 200', ()=>{
    return request(endPoint)
    .delete('/typeservice/hack/' + typeServiceId)
    .then(response=>{
        expect(response.status).toBe(200)
    }).catch(fail)
})

test('Delete de Comentario OJ Hack- retorno 200', ()=>{
    return request(endPoint)
    .delete('/comments/hack/' + commentOJId)
    .then(response=>{
        expect(response.status).toBe(200)
    }).catch(fail)
})

test('Delete de Comentario JO Hack- retorno 200', ()=>{
    return request(endPoint)
    .delete('/comments/hack/' + commentJOId)
    .then(response=>{
        expect(response.status).toBe(200)
    }).catch(fail)
})