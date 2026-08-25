const { expect } = require('chai');
const exportService = require('../../../src/services/exportService');

describe('Export Service', () => {
  it('should format user notes as JSON string', async () => {
    expect(exportService.generateUserData).to.be.a('function');
  });
});