const request = require('supertest');
const { expect } = require('chai');
const app = require('../../../src/app');

describe('Notes API Integration', () => {
  it('should reject requests without an authentication token', async () => {
    try {
      const res = await request(app).get('/api/notes');
      expect(res.status).to.equal(401);
      expect(res.body.status).to.equal('fail');
      expect(res.body.message).to.equal('Please log in');
    } catch (err) {
      throw new Error(`Unauthorized access check failed: ${err.message}`);
    }
  });

  it('should return 401 for an invalid or malformed token', async () => {
    try {
      const res = await request(app)
        .get('/api/notes')
        .set('Authorization', 'Bearer invalid.token.here');
      expect(res.status).to.equal(401);
      expect(res.body.message).to.equal('Invalid or expired token');
    } catch (err) {
      throw new Error(`Invalid token verification failed: ${err.message}`);
    }
  });

  it('should reject invalid paths under the notes prefix with 401 if unauthenticated', async () => {
    try {
      const res = await request(app).get('/api/notes/invalid/route/path');
      expect(res.status).to.equal(401);
    } catch (err) {
      throw new Error(`Protected boundary check failed: ${err.message}`);
    }
  });
});