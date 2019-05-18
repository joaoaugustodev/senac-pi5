import 'jest'
import * as request from 'supertest'

//const endPoint = 'localhost:3000'
const endPoint = 'https://cc8077f0.ngrok.io'
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
        "sunday": true,
        "monday": true,
        "tuesday": true,
        "wednesday": true,
        "thursday": false,
        "friday": false,
        "saturday": false
    },
    "startTime": 12,
    "endTime": 18
}

let jobberId = ''

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

/* - NECESSARIO CONCERTAR .... PROVAVEL PROBLEMA NO ID
test('Edição de Owner - retorno 200', ()=>{
    return request(endPoint)
    .put('/edit/' + userId)
    .set('Authorization', 'Bearer ' + token)
    .send(modifiedUser)
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

test('Créditos para Owner - retorno 200', ()=>{
    return request(endPoint)
    .put('/user/credit/' + userId + '/40')
    .set('Authorization', 'Bearer ' + token)
    .then(response=>{
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

test('Consulta de Animal - retorno 200', ()=>{
    return request(endPoint)
    .get('/animal/' + animalId)
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

test('Delete de Animal - retorno 200', ()=>{
    return request(endPoint)
    .delete('/animal/delete?id=' + animalId)
    .set('Authorization', 'Bearer ' + token)
    .then(response=>{
        expect(response.status).toBe(200)
    }).catch(fail)
})

test('Comentários do Owner - retorno  200', ()=>{
    return request(endPoint)
    .get('/user/comments/5ca8c905725d7b51b271c31e')
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

test('Delete de Animal Hack- retorno 200', ()=>{
    return request(endPoint)
    .delete('/animal/hack/' + animalId)
    .then(response=>{
        expect(response.status).toBe(200)
    }).catch(fail)
})