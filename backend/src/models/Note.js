const { pool } = require('../config/db');

exports.create = async (userId, title, content) => {
  const result = await pool.query(
    'INSERT INTO notes (user_id, title, content) VALUES ($1, $2, $3) RETURNING *',
    [userId, title, content]
  );
  return result.rows[0];
};

exports.findAllByUserId = async (userId) => {
  const result = await pool.query(
    'SELECT * FROM notes WHERE user_id = $1 ORDER BY created_at DESC',
    [userId]
  );
  return result.rows;
};

exports.findById = async (id) => {
  const result = await pool.query('SELECT * FROM notes WHERE id = $1', [id]);
  return result.rows[0];
};

exports.update = async (id, title, content) => {
  const result = await pool.query(
    'UPDATE notes SET title = $1, content = $2, updated_at = NOW() WHERE id = $3 RETURNING *',
    [title, content, id]
  );
  return result.rows[0];
};

exports.delete = async (id) => {
  await pool.query('DELETE FROM notes WHERE id = $1', [id]);
};