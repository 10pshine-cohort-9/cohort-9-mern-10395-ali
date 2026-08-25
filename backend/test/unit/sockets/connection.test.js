const { expect } = require('chai');
const socketConfig = require('../../../src/config/socket');

describe('Socket.IO Configuration', () => {
  it('should export an init function', () => {
    expect(socketConfig.init).to.be.a('function');
  });
});