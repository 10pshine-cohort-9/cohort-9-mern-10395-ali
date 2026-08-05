const { expect } = require('chai');
const tokenService = require('../../src/services/tokenService');

describe('Token Service', () => {
  it('should generate a valid JWT', () => {
    const id = '123';
    const token = tokenService.generate(id);
    const decoded = tokenService.verify(token);
    expect(decoded.id).to.equal(id);
  });
});