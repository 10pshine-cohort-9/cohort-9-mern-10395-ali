const { expect } = require('chai');
const socketConfig = require('../../../src/config/socket');

describe('Socket Configuration Structure', () => {
  it('should export the socket initialization function', () => {
    expect(socketConfig.init).to.be.a('function');
  });

  it('should export the user emission function', () => {
    expect(socketConfig.emitToUser).to.be.a('function');
  });
});