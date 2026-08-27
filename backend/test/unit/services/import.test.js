const { expect } = require('chai');
const Note = require('../../../src/models/Note');
const importService = require('../../../src/services/importService');

describe('Import Service Behavioral Check', () => {
  const originalCreate = Note.create;

  afterEach(() => {
    Note.create = originalCreate;
  });

  it('should track imported and skipped items correctly', async () => {
    try {
      Note.create = async () => ({ id: 'new-note-id' });
      const testData = [
        { title: 'Valid Note', content: 'Some content' },
        null,
        { title: '  ', content: '' }
      ];

      const result = await importService.processImport('user-123', testData);
      
      expect(result.imported).to.equal(1);
      expect(result.skipped).to.equal(2);
    } catch (err) {
      throw new Error(`Import service test failure: ${err.message}`);
    }
  });
});