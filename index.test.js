const app = require('./index.js');
const supertest = require('supertest');
const request = supertest(app);


it('gets the test endpoint', async done => {
    const res = await request.get('/api')

    expect(res.status).toBe(200);

    done();
})