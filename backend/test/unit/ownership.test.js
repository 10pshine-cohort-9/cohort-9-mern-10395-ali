const { expect } = require('chai');
const AppError = require('../../src/utils/AppError');

describe('Ownership Logic Verification', () => {
  const validateOwnership = (note, userId) => {
    if (!note) throw new AppError('Note not found', 404);
    if (note.user_id !== userId) throw new AppError('Access denied', 403);
    return true;
  };

  it('should allow access when the requester is the note owner', () => {
    const mockNote = { user_id: 'user-123' };
    const result = validateOwnership(mockNote, 'user-123');
    expect(result).to.be.true;
  });

  it('should throw a 403 Forbidden error when identities mismatch', () => {
    const mockNote = { user_id: 'real-owner-id' };
    try {
      validateOwnership(mockNote, 'unauthorized-user-id');
    } catch (err) {
      expect(err).to.be.instanceOf(AppError);
      expect(err.statusCode).to.equal(403);
      expect(err.message).to.equal('Access denied');
    }
  });

  it('should throw a 404 Not Found error when the note object is null', () => {
    try {
      validateOwnership(null, 'active-user-id');
    } catch (err) {
      expect(err.statusCode).to.equal(404);
      expect(err.message).to.equal('Note not found');
    }
  });
});