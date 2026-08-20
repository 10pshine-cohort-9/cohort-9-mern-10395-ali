const { expect } = require('chai');
const { pool } = require('../../../src/config/db');
const notesService = require('../../../src/services/notesService');

describe('Notes Search Service Logic', () => {
  const originalQuery = pool.query;

  afterEach(() => {
    pool.query = originalQuery;
  });

  it('should include ILIKE parameters when a search term is provided', async () => {
    let capturedParams = [];
    pool.query = async (text, params) => {
      capturedParams = params;
      return { rows: [] };
    };

    await notesService.fetchUserNotes('user-123', { search: 'industrial' });
    
    expect(capturedParams).to.have.lengthOf(2);
    expect(capturedParams[1]).to.equal('%industrial%');
  });

  it('should only use the user ID when no search term is provided', async () => {
    let capturedParams = [];
    pool.query = async (text, params) => {
      capturedParams = params;
      return { rows: [] };
    };

    await notesService.fetchUserNotes('user-123', {});
    
    expect(capturedParams).to.have.lengthOf(1);
    expect(capturedParams[0]).to.equal('user-123');
  });
});