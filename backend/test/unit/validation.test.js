const { expect } = require('chai');
const { noteSchema } = require('../../src/validations/noteValidation');

describe('Note Validation', () => {
  it('should fail on empty title', () => {
    const result = noteSchema.validate({ content: 'test' });
    expect(result.error).to.exist;
  });
});