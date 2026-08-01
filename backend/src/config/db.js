const { Pool } = require('pg');
const logger = require('./logger');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

const connectDB = async () => {
    try{
        const client = await pool.connect();
        logger.info('PostgreSQL Connected Sucessfully to SupaBase');
        client.release();
    }catch (error) {
        logger.error('Database connection failed', error.message);
        process.exit(1);
    }
};

module.exports = {pool, connectDB};