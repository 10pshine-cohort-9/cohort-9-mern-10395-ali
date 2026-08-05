const { expect } = require('chai');
const authService = require('../../src/services/authService');

describe('Auth Service Structure', () => {
  it('should export register and login functions', () => {
    expect(authService.register).to.be.a('function');
    expect(authService.login).to.be.a('function');
  });
});