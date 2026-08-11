const request = require('supertest');
const { expect } = require('chai');
const app = require('../../../src/app');

describe('Notes API Integration', () => {
  it('should reject requests without an authentication token', async () => {
    const res = await request(app).get('/api/notes');
    
    expect(res.status).to.equal(401);
    expect(res.body.status).to.equal('fail');
    expect(res.body.message).to.equal('Please log in');
  });

  it('should return 401 for an invalid or malformed token', async () => {
    const res = await request(app)
      .get('/api/notes')
      .set('Authorization', 'Bearer invalid.token.here');
    
    expect(res.status).to.equal(401);
    expect(res.body.message).to.equal('Invalid or expired token');
  });

  it('should reject invalid paths under the notes prefix with 401 if unauthenticated', async () => {
    // FIX: Expect 401 because the Auth Middleware protects the entire /api/notes/* tree
    const res = await request(app).get('/api/notes/invalid/route/path');
    
    expect(res.status).to.equal(401);
  });
});