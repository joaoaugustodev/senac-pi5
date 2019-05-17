import 'jest'
import * as request from 'supertest'

//const endPoint = 'localhost:3000'
const endPoint = 'http://f721bc95.ngrok.io'
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiTWFyY2VsbyIsImlhdCI6MTU1NzQ0MDE1Nn0.rILKnhwrVXCgW4vdorpzpBHlLaiJWjBLyDRhSP8rk2s"

test('Comentarios do Owner - retorno  200', ()=>{
    return request(endPoint)
    .get('/user/animals/5ca8c905725d7b51b271c31e')
    .set('Authorization', 'Bearer ' + token)
    .then(response=>{
        expect(response.status).toBe(200)
    }).catch(fail)
})