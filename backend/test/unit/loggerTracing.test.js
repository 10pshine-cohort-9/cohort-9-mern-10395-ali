const { expect } = require('chai');

describe('Logger Observability', () => {
  it('should verify logger is active', () => {
    // FIX: Changed from ../../../ to ../../
    const logger = require('../../src/config/logger');
    expect(logger).to.exist;
  });
});