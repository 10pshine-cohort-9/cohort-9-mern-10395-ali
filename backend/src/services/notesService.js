const { pool } = require('../config/db');
const Note = require('../models/Note');
const User = require('../models/User');
const AppError = require('../utils/AppError');

exports.fetchUserNotes = async (userId, filters = {}) => {
  try {
    const { search } = filters;
    let query = 'SELECT * FROM notes WHERE user_id = $1';
    const params = [userId];

    if (search) {
      query += ' AND (title ILIKE $2 OR content ILIKE $2)';
      params.push(`%${search}%`);
    }

    query += ' ORDER BY updated_at DESC';
    const result = await pool.query(query, params);
    return result.rows;
  } catch (err) {
    throw err;
  }
};

exports.createNewNote = async (userId, data) => {
  try {
    return await Note.create(userId, data.title, data.content);
  } catch (err) {
    throw err;
  }
};

exports.getNoteDetail = async (id, userId) => {
  try {
    const note = await Note.findById(id);
    if (!note || note.user_id !== userId) {
      throw new AppError('Note not found', 404);
    }
    return note;
  } catch (err) {
    throw err;
  }
};

exports.editNote = async (id, userId, data) => {
  try {
    const note = await Note.findById(id);
    if (!note || note.user_id !== userId) {
      throw new AppError('Note not found', 404);
    }
    return await Note.update(id, userId, data.title, data.content);
  } catch (err) {
    throw err;
  }
};

exports.removeNote = async (id, userId) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    await client.query("SELECT set_config('app.user_id', $1, true)", [userId]);

    const noteCheck = await client.query('SELECT * FROM notes WHERE id = $1', [id]);
    const note = noteCheck.rows[0];

    if (!note || note.user_id !== userId) {
      throw new AppError('Note not found', 404);
    }

    await client.query('DELETE FROM notes WHERE id = $1', [id]);

    const userUpdate = await client.query(
      'UPDATE users SET deleted_notes_count = deleted_notes_count + 1 WHERE id = $1 RETURNING deleted_notes_count',
      [userId]
    );

    await client.query('COMMIT');
    return userUpdate.rows[0].deleted_notes_count;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
};