import 'jest'
import * as request from 'supertest'

test('get user/comments', ()=>{
    return request('http://localhost:3000')
    .get('/user/comments/5ca8ca38e5503f56cf7ce41b')
    .then(response=>{
        expect(response.status).toBe(401)
    }).catch(fail)
})