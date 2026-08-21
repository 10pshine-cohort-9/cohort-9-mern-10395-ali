const { pool } = require('../config/db');

const setSessionUser = async (client, userId) => {
  await client.query("SELECT set_config('app.user_id', $1, true)", [userId]);
};

exports.create = async (userId, title, content) => {
  const client = await pool.connect();
  try {
    await setSessionUser(client, userId);
    const result = await client.query(
      'INSERT INTO notes (user_id, title, content) VALUES ($1, $2, $3) RETURNING *',
      [userId, title, content]
    );
    return result.rows[0];
  } catch (err) {
    throw err;
  } finally {
    client.release();
  }
};

exports.findAllByUserId = async (userId) => {
  const client = await pool.connect();
  try {
    await setSessionUser(client, userId);
    const result = await client.query(
      'SELECT * FROM notes WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );
    return result.rows;
  } catch (err) {
    throw err;
  } finally {
    client.release();
  }
};

exports.findById = async (id) => {
  try {
    const result = await pool.query('SELECT * FROM notes WHERE id = $1', [id]);
    return result.rows[0];
  } catch (err) {
    throw err;
  }
};

exports.update = async (id, userId, title, content) => {
  const client = await pool.connect();
  try {
    await setSessionUser(client, userId);
    const result = await client.query(
      'UPDATE notes SET title = $1, content = $2, updated_at = NOW() WHERE id = $3 RETURNING *',
      [title, content, id]
    );
    return result.rows[0];
  } catch (err) {
    throw err;
  } finally {
    client.release();
  }
};

exports.delete = async (id, userId) => {
  const client = await pool.connect();
  try {
    await setSessionUser(client, userId);
    await client.query('DELETE FROM notes WHERE id = $1', [id]);
  } catch (err) {
    throw err;
  } finally {
    client.release();
  }
};