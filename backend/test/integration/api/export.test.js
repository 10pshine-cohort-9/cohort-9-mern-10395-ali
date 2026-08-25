const request = require('supertest');
const app = require('../../../src/app');
const { expect } = require('chai');

describe('Export API Security', () => {
  it('should deny export without token', async () => {
    const res = await request(app).get('/api/data/export');
    expect(res.status).to.equal(401);
  });
});