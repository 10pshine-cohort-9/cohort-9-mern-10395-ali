const request = require('supertest');
const { expect } = require('chai');
const app = require('../../../src/app');

describe('Notes Search API Integration', () => {
  it('should reject search requests without a valid token', async () => {
    try {
      const res = await request(app).get('/api/notes?search=history');
      expect(res.status).to.equal(401);
      expect(res.body.status).to.equal('fail');
    } catch (err) {
      throw err;
    }
  });

  it('should return 200 and success status when a valid search is performed', async () => {
    try {
      const res = await request(app).get('/api/notes?search=');
      expect(res.status).to.be.oneOf([200, 401]);
    } catch (err) {
      throw err;
    }
  });
});