const { expect } = require('chai');
const notesService = require('../../../src/services/notesService');
const userService = require('../../../src/services/userService');

describe('Critical Logic Hardening', () => {
  it('should throw error when note id is invalid in detail fetch', async () => {
    let errorCaught = null;
    try {
      await notesService.getNoteDetail(null, 'user-1');
    } catch (err) {
      errorCaught = err;
    }
    expect(errorCaught).to.not.be.null;
  });

  it('should reject whitespace names in profile update', async () => {
    let errorCaught = null;
    try {
      await userService.updateProfile('user-1', { name: '   ' });
    } catch (err) {
      errorCaught = err;
    }
    expect(errorCaught.statusCode).to.equal(400);
  });
});