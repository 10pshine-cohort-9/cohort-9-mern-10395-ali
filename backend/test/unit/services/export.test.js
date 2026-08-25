const { expect } = require('chai');
const Note = require('../../../src/models/Note');
const exportService = require('../../../src/services/exportService');

describe('Export Service Behavioral Check', () => {
  const originalFindAll = Note.findAllByUserId;

  afterEach(() => {
    Note.findAllByUserId = originalFindAll;
  });

  it('should format user notes as a valid JSON string', async () => {
    const mockNotes = [{ title: 'History Note', content: 'Industrial Revolution' }];
    Note.findAllByUserId = async () => mockNotes;

    const result = await exportService.generateUserData('user-123');
    
    expect(result).to.be.a('string');
    const parsed = JSON.parse(result);
    expect(parsed[0].title).to.equal('History Note');
  });
});