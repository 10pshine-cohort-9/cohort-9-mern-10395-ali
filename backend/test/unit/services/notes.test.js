const { expect } = require('chai');
const notesService = require('../../../src/services/notesService');

describe('Notes Service Logic', () => {
  it('should verify fetch function exists', () => {
    expect(notesService.fetchUserNotes).to.be.a('function');
  });
});