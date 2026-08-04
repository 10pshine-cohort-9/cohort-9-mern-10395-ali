const { expect } = require('chai');
const request = require('supertest');
const app = require('../../src/app');

describe('Auth Integration', () => {
  it('should return 404 for an invalid authentication endpoint', async () => {
    const res = await request(app).post('/api/auth/invalid-route');
    expect(res.status).to.equal(404);
    expect(res.body.status).to.equal('fail');
  });
});