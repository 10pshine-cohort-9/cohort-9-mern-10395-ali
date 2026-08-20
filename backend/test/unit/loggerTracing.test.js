const { expect } = require('chai');
const globalErrorHandler = require('../../src/middlewares/errorHandler');

describe('Logger Tracing Verification', () => {
  it('should pass error details to the request-scoped logger', () => {
    let capturedLog = null;
    const mockError = new Error('Tracing Failure');
    const req = {
      id: 'trace-123',
      log: { error: (data) => { capturedLog = data; } },
      originalUrl: '/api/test',
      method: 'POST'
    };
    const res = { status: () => ({ json: () => {} }) };

    globalErrorHandler(mockError, req, res, () => {});

    expect(capturedLog).to.not.be.null;
    expect(capturedLog.err.message).to.equal('Tracing Failure');
    expect(capturedLog.path).to.equal('/api/test');
    expect(capturedLog.method).to.equal('POST');
  });
});