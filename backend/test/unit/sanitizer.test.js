const { expect } = require('chai');
const { cleanText } = require('../../src/utils/sanitizer');

describe('Text Sanitizer', () => {
  it('should trim whitespace', () => {
    expect(cleanText('  hello  ')).to.equal('hello');
  });
});