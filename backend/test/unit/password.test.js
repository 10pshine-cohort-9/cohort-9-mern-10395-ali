const { expect } = require('chai');
const passwordService = require('../../src/services/passwordService');

describe('Password Service', () => {
  it('should hash and compare passwords correctly', async () => {
    const raw = 'pass123';
    const hash = await passwordService.hash(raw);
    expect(hash).to.not.equal(raw);
    expect(await passwordService.compare(raw, hash)).to.be.true;
  });
});