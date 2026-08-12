const { expect } = require('chai');
const Note = require('../../../src/models/Note');

describe('Note Model Structure', () => {
  it('should define create and update methods', () => {
    expect(Note.create).to.be.a('function');
    expect(Note.update).to.be.a('function');
  });
});