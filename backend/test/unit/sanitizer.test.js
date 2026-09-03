const { expect } = require('chai');
const { cleanText } = require('../../src/utils/sanitizer');
const { formatUserQuery } = require('../../src/utils/queryBuilder');

describe('Text Sanitizer', () => {
  it('should trim whitespace', () => {
    expect(cleanText('  hello  ')).to.equal('hello');
  });
});

describe('Query Builder', () => {
  it('should scope the notes query to a user', () => {
    const query = formatUserQuery('user-1');

    expect(query.text).to.contain('user_id = $1');
    expect(query.values).to.deep.equal(['user-1']);
  });
});