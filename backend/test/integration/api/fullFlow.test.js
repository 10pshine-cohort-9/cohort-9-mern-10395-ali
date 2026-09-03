const request = require('supertest');
const { expect } = require('chai');
const app = require('../../../src/app');
const { pool } = require('../../../src/config/db');
const tokenService = require('../../../src/services/tokenService');
const passwordService = require('../../../src/services/passwordService');

const note = {
  id: 'note-1',
  user_id: 'user-1',
  title: 'First Note',
  content: '<p>Some body</p>',
  created_at: '2026-01-01T00:00:00.000Z',
  updated_at: '2026-01-02T00:00:00.000Z'
};

const originalQuery = pool.query;
const originalConnect = pool.connect;

function routeQuery(text, params = []) {
  if (text.includes('set_config')) return { rows: [] };
  if (text.includes('SET deleted_notes_count')) return { rowCount: 1, rows: [] };
  if (text.includes('DELETE FROM notes')) return { rowCount: 1, rows: [{ id: params[0] }] };
  if (text.includes('UPDATE notes')) return { rows: [{ ...note, title: params[0], content: params[1] }] };
  if (text.includes('INSERT INTO notes')) return { rows: [{ ...note, id: 'note-9', title: params[1], content: params[2] }] };
  if (text.includes('INSERT INTO users')) return { rows: [{ id: 'user-1', name: params[0], email: params[1], deleted_notes_count: 0 }] };
  if (text.includes('FROM users WHERE email')) return { rows: [{ id: 'user-1', name: 'Test User', email: params[0], password_hash: 'placeholder', deleted_notes_count: 0 }] };
  if (text.includes('FROM users WHERE id')) return { rows: [{ id: 'user-1', name: 'Test User', email: 'test@example.com', deleted_notes_count: 0 }] };
  if (text.includes('FROM notes WHERE user_id')) return { rows: [note, { ...note, id: 'note-2', title: 'Second Note' }] };
  if (text.includes('FROM notes WHERE id')) return { rows: [note] };
  return { rows: [], rowCount: 0 };
}

before(() => {
  pool.query = async (text, params = []) => routeQuery(text, params);
  pool.connect = async () => ({
    query: async (text, params = []) => routeQuery(text, params),
    release: () => {}
  });
});

after(() => {
  pool.query = originalQuery;
  pool.connect = originalConnect;
});

afterEach(() => {
  pool.query = async (text, params = []) => routeQuery(text, params);
});

const authenticated = () => ({ Authorization: `Bearer ${tokenService.generate('user-1')}` });

describe('Full API flow', () => {
  describe('authentication', () => {
    it('creates an account and returns a token', async () => {
      try {
        const res = await request(app)
          .post('/api/auth/signup')
          .send({ name: 'New User', email: 'new@example.com', password: 'password123' });

        expect(res.status).to.equal(201);
        expect(res.body.data.token).to.be.a('string');
        expect(res.body.data.user.email).to.equal('new@example.com');
      } catch (err) {
        throw err;
      }
    });

    it('rejects a signup with an email that is already in use', async () => {
      try {
        pool.query = async (text, params = []) => {
          if (text.includes('INSERT INTO users')) {
            const err = new Error('duplicate key value violates unique constraint');
            err.code = '23505';
            throw err;
          }
          return routeQuery(text, params);
        };

        const res = await request(app)
          .post('/api/auth/signup')
          .send({ name: 'Again', email: 'dup@example.com', password: 'password123' });

        expect(res.status).to.equal(400);
        expect(res.body.message).to.equal('Email already in use');
      } catch (err) {
        throw err;
      }
    });

    it('logs a user in with valid credentials', async () => {
      try {
        const hash = await passwordService.hash('password123');
        pool.query = async (text, params = []) => {
          if (text.includes('FROM users WHERE email')) {
            return { rows: [{ id: 'user-1', name: 'Test User', email: params[0], password_hash: hash, deleted_notes_count: 0 }] };
          }
          return routeQuery(text, params);
        };

        const res = await request(app)
          .post('/api/auth/login')
          .send({ email: 'test@example.com', password: 'password123' });

        expect(res.status).to.equal(200);
        expect(res.body.data.token).to.be.a('string');
        expect(res.body.data.user.password_hash).to.be.undefined;
      } catch (err) {
        throw err;
      }
    });

    it('rejects a login with the wrong password', async () => {
      try {
        const hash = await passwordService.hash('real-password');
        pool.query = async (text, params = []) => {
          if (text.includes('FROM users WHERE email')) {
            return { rows: [{ id: 'user-1', name: 'Test User', email: params[0], password_hash: hash, deleted_notes_count: 0 }] };
          }
          return routeQuery(text, params);
        };

        const res = await request(app)
          .post('/api/auth/login')
          .send({ email: 'test@example.com', password: 'wrong-password' });

        expect(res.status).to.equal(401);
      } catch (err) {
        throw err;
      }
    });
  });

  describe('notes', () => {
    it('returns the notes for the current user', async () => {
      try {
        const res = await request(app).get('/api/notes').set(authenticated());

        expect(res.status).to.equal(200);
        expect(res.body.data.notes).to.have.lengthOf(2);
      } catch (err) {
        throw err;
      }
    });

    it('accepts a search term when listing notes', async () => {
      try {
        const res = await request(app).get('/api/notes?search=First').set(authenticated());

        expect(res.status).to.equal(200);
      } catch (err) {
        throw err;
      }
    });

    it('creates a new note', async () => {
      try {
        const res = await request(app)
          .post('/api/notes')
          .set(authenticated())
          .send({ title: 'New Note', content: 'Some content' });

        expect(res.status).to.equal(201);
        expect(res.body.data.note.title).to.equal('New Note');
      } catch (err) {
        throw err;
      }
    });

    it('rejects a note without a title', async () => {
      try {
        const res = await request(app)
          .post('/api/notes')
          .set(authenticated())
          .send({ content: 'Missing a title' });

        expect(res.status).to.equal(400);
      } catch (err) {
        throw err;
      }
    });

    it('returns a single note', async () => {
      try {
        const res = await request(app).get('/api/notes/note-1').set(authenticated());

        expect(res.status).to.equal(200);
        expect(res.body.data.note.id).to.equal('note-1');
      } catch (err) {
        throw err;
      }
    });

    it('updates a note', async () => {
      try {
        const res = await request(app)
          .put('/api/notes/note-1')
          .set(authenticated())
          .send({ title: 'Edited Note', content: 'Updated body' });

        expect(res.status).to.equal(200);
        expect(res.body.data.note.title).to.equal('Edited Note');
      } catch (err) {
        throw err;
      }
    });

    it('deletes a note', async () => {
      try {
        const res = await request(app).delete('/api/notes/note-1').set(authenticated());

        expect(res.status).to.equal(204);
      } catch (err) {
        throw err;
      }
    });

    it('returns 404 when the note does not exist', async () => {
      try {
        pool.query = async (text, params = []) => {
          if (text.includes('FROM users WHERE id')) return routeQuery(text, params);
          return { rows: [], rowCount: 0 };
        };

        const res = await request(app).get('/api/notes/missing-note').set(authenticated());

        expect(res.status).to.equal(404);
      } catch (err) {
        throw err;
      }
    });

    it('returns 404 when the note belongs to another user', async () => {
      try {
        pool.query = async (text, params = []) => {
          if (text.includes('FROM notes WHERE id')) {
            return { rows: [{ ...note, user_id: 'user-2' }] };
          }
          return routeQuery(text, params);
        };

        const res = await request(app).get('/api/notes/note-1').set(authenticated());

        expect(res.status).to.equal(404);
      } catch (err) {
        throw err;
      }
    });

    it('blocks requests without a token', async () => {
      try {
        const res = await request(app).get('/api/notes');

        expect(res.status).to.equal(401);
      } catch (err) {
        throw err;
      }
    });

    it('blocks requests with an invalid token', async () => {
      try {
        const res = await request(app)
          .get('/api/notes')
          .set('Authorization', 'Bearer not.a.token');

        expect(res.status).to.equal(401);
      } catch (err) {
        throw err;
      }
    });
  });

  describe('profile and data', () => {
    it('returns the current profile', async () => {
      try {
        const res = await request(app).get('/api/users/me').set(authenticated());

        expect(res.status).to.equal(200);
        expect(res.body.data.user.email).to.equal('test@example.com');
      } catch (err) {
        throw err;
      }
    });

    it('exports the notes as a downloadable file', async () => {
      try {
        const res = await request(app).get('/api/data/export').set(authenticated());

        expect(res.status).to.equal(200);
        expect(res.headers['content-disposition']).to.contain('notes_export.json');
      } catch (err) {
        throw err;
      }
    });

    it('imports valid notes and skips invalid entries', async () => {
      try {
        const res = await request(app)
          .post('/api/data/import')
          .set(authenticated())
          .send([
            { title: 'Valid Note', content: 'Body' },
            null,
            { title: '   ', content: '' }
          ]);

        expect(res.status).to.equal(200);
        expect(res.body.data).to.deep.equal({ imported: 1, skipped: 2 });
      } catch (err) {
        throw err;
      }
    });

    it('rejects a malformed import payload', async () => {
      try {
        const res = await request(app)
          .post('/api/data/import')
          .set(authenticated())
          .send({ title: 'not an array' });

        expect(res.status).to.equal(400);
      } catch (err) {
        throw err;
      }
    });
  });

  describe('error handling', () => {
    it('returns a generic message for unexpected errors', async () => {
      try {
        pool.query = async (text, params = []) => {
          if (text.includes('FROM users WHERE id')) return routeQuery(text, params);
          throw new Error('database exploded');
        };

        const res = await request(app).get('/api/notes').set(authenticated());

        expect(res.status).to.equal(500);
        expect(res.body.message).to.equal('An internal error occurred');
      } catch (err) {
        throw err;
      }
    });
  });
});
