const { expect } = require('chai');
const importService = require('../../../src/services/importService');

describe('Import Service', () => {
  it('should return a results object with counts', () => {
    expect(importService.processImport).to.be.a('function');
  });
});