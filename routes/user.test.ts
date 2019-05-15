import 'jest'
import * as request from 'supertest'

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiTWFyY2VsbyIsImlhdCI6MTU1NzQ0MDE1Nn0.rILKnhwrVXCgW4vdorpzpBHlLaiJWjBLyDRhSP8rk2s"

test('get user/comments', ()=>{
    return request('https://2bad5f79.ngrok.io')
    .get('/user/animals/5ca799dadf0348617014c496')
    .set('Authorization', 'Bearer ' + token)
    .then(response=>{
        expect(response.status).toBe(200)
    }).catch(fail)
})