const { Pool } = require('pg');
const logger = require('./logger');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: true
    }
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