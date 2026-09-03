const { expect } = require('chai');
const { pool } = require('../../../src/config/db');
const notesService = require('../../../src/services/notesService');

describe('Critical Logic Hardening', () => {
  it('should throw a 404 when the requested note is missing', async () => {
    const originalQuery = pool.query;
    pool.query = async () => ({ rows: [], rowCount: 0 });

    try {
      await notesService.getNoteDetail('missing-note', 'user-1');
      expect.fail('expected the lookup to fail');
    } catch (err) {
      expect(err.statusCode).to.equal(404);
    } finally {
      pool.query = originalQuery;
    }
  });
});
