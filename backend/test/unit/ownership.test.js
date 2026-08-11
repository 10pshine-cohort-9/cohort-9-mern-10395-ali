const { expect } = require('chai');
const Note = require('../../src/models/Note');
const ownershipMiddleware = require('../../src/middlewares/ownershipMiddleware');
const AppError = require('../../src/utils/AppError');

describe('Ownership Middleware Verification', () => {
  let req, res, next, capturedError;
  const originalFindById = Note.findById;

  afterEach(() => {
    Note.findById = originalFindById;
  });

  beforeEach(() => {
    capturedError = undefined;
    req = { 
      params: { id: 'note-123' }, 
      user: { id: 'active-user' } 
    };
    res = {};
    next = (err) => { capturedError = err; };
  });

  it('should call next with no arguments when user is the owner', async () => {
    Note.findById = async () => ({ id: 'note-123', user_id: 'active-user' });
    
    await ownershipMiddleware(req, res, next);
    expect(capturedError).to.be.undefined;
  });

  it('should call next with a 403 AppError when identities mismatch', async () => {
    Note.findById = async () => ({ id: 'note-123', user_id: 'other-user' });
    
    await ownershipMiddleware(req, res, next);
    
    expect(capturedError).to.be.instanceOf(AppError);
    expect(capturedError.statusCode).to.equal(403);
    expect(capturedError.message).to.equal('Access denied');
  });

  it('should call next with a 404 AppError when note is not found', async () => {
    Note.findById = async () => null;
    
    await ownershipMiddleware(req, res, next);
    
    expect(capturedError).to.be.instanceOf(AppError);
    expect(capturedError.statusCode).to.equal(404);
    expect(capturedError.message).to.equal('Note not found');
  });
});