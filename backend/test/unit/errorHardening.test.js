const { expect } = require('chai');
const globalErrorHandler = require('../../src/middlewares/errorHandler');

describe('Error Handler Security Enforcements', () => {
  it('should return a 500 status and the correct requestId for non-operational errors', () => {
    const mockError = new Error('Database Crash');
    mockError.statusCode = 400;
    mockError.isOperational = false;

    const req = { 
      id: 'dynamic-uuid-789', 
      log: { error: () => {} } 
    };
    const res = {
      status: function(code) {
        this.statusCode = code;
        return this;
      },
      json: function(data) {
        this.body = data;
        return this;
      }
    };

    globalErrorHandler(mockError, req, res, () => {});
    
    expect(res.statusCode).to.equal(500);
    expect(res.body.requestId).to.equal('dynamic-uuid-789');
    expect(res.body.status).to.equal('error');
    expect(res.body.message).to.equal('An internal error occurred');
  });
});