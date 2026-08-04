const { Pool } = require('pg');
const logger = require('./logger');

require('dotenv').config();

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined');
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  connectionTimeoutMillis: 5000,
  ssl: process.env.NODE_ENV === 'production' 
    ? { rejectUnauthorized: true } 
    : { rejectUnauthorized: false }
});

pool.on('error', (err) => {
  logger.error({ err }, 'Unexpected pool error');
});

const connectDB = async () => {
  try {
    const client = await pool.connect();
    logger.info('🐘 PostgreSQL Connected Successfully');
    client.release();
  } catch (err) {
    logger.error({ err }, 'Database connection failed');
    throw err;
  }
};

module.exports = { pool, connectDB };