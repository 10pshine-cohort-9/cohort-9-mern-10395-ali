const { expect } = require('chai');
const { noteSchema } = require('../../src/validations/noteValidation');

describe('Note Validation Logic', () => {
  it('should fail when the title field is missing', () => {
    const result = noteSchema.validate({ content: 'test content' });
    expect(result.error).to.exist;
  });

  it('should fail when the title is an empty string', () => {
    const result = noteSchema.validate({ title: '', content: 'test content' });
    expect(result.error).to.exist;
  });

  it('should pass with valid title and content', () => {
    const result = noteSchema.validate({ title: 'Valid Title', content: 'Valid Content' });
    expect(result.error).to.not.exist;
  });
});