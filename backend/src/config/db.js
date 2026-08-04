const { Pool } = require('pg');
const logger = require('./logger');

require('dotenv').config();

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined in environment variables');
}

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    connectionTimeoutMillis: 5000,
    ssl: {
        rejectUnauthorized: false
    },
});

pool.on('error', (err) => {
    logger.error({ err }, 'Unexpected PostgreSQL pool error');
});

const connectDB = async () => {
    try{
        const client = await pool.connect();
        logger.info('PostgreSQL Connected Sucessfully to SupaBase');
        client.release();
    }catch (err) {
        logger.error({err}, 'Database connection failed');
        throw err;
    }
};

module.exports = {pool, connectDB};