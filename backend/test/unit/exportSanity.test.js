const { expect } = require('chai');
const Note = require('../../src/models/Note');
const exportService = require('../../src/services/exportService');

describe('Export Data Sanity', () => {
  const originalFindAll = Note.findAllByUserId;

  afterEach(() => {
    Note.findAllByUserId = originalFindAll;
  });

  it('should verify the JSON structure of exported data', async () => {
    try {
      Note.findAllByUserId = async () => [];
      const result = await exportService.generateUserData('mock-id');
      
      expect(result).to.be.a('string');
      expect(result.startsWith('[')).to.be.true;
    } catch (err) {
      throw new Error(`Export sanity test failure: ${err.message}`);
    }
  });
});