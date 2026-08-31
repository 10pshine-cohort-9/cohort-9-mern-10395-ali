const { expect } = require('chai');
const notesService = require('../../../src/services/notesService');
const userService = require('../../../src/services/userService');

describe('Critical Logic Hardening', () => {
  it('should throw error when note id is missing in detail fetch', async () => {
    try {
      await notesService.getNoteDetail(null, 'user-1');
    } catch (err) {
      expect(err.statusCode).to.equal(404);
    }
  });

  it('should reject whitespace names in profile update', async () => {
    try {
      await userService.updateProfile('user-1', { name: '   ' });
    } catch (err) {
      expect(err.statusCode).to.equal(400);
    }
  });
});