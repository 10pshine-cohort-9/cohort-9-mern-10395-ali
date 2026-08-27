const Note = require('../models/Note');
const AppError = require('../utils/AppError');
const { pool } = require('../config/db');

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
  try {
    const note = await Note.findById(id);
    if (!note || note.user_id !== userId) {
      throw new AppError('Note not found', 404);
    }
    await Note.delete(id, userId);
    return id;
  } catch (err) {
    throw err;
  }
};
