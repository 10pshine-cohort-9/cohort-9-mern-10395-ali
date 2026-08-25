const { expect } = require('chai');
const socketConfig = require('../../../src/config/socket');

describe('Socket connection state', () => {
  it('should throw an error if getIO is accessed before initialization', () => {
    expect(() => socketConfig.getIO()).to.throw('Socket.io not initialized');
  });
});