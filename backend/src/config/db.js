const { Pool } = require('pg');
const logger = require('./logger');

// new connection for supabase
const pool = new Pool({
    ConnectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

// connection test
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