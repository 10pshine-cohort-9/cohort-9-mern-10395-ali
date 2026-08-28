const { pool } = require('../config/db');

exports.findByEmail = async (email) => {
  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0] || null;
  } catch (err) {
    throw err;
  }
};

exports.findById = async (id) => {
  try {
    const result = await pool.query('SELECT id, name, email, deleted_notes_count FROM users WHERE id = $1', [id]);
    return result.rows[0] || null;
  } catch (err) {
    throw err;
  }
};

exports.create = async (name, email, passwordHash) => {
  try {
    const result = await pool.query(
      'INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email, deleted_notes_count',
      [name, email, passwordHash]
    );
    return result.rows[0];
  } catch (err) {
    throw err;
  }
};
