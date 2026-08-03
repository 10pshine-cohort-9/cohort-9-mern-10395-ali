const app = require('./src/app');
const { connectDB } = require('./src/config/db');
const logger = require('./src/config/logger');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try{
        await connectDB();
        const server = app.listen(PORT, () => {
            logger.info(`Server is running on port ${PORT}`);
        });

        server.on('error', (err) => {
            logger.error({err},'Server failed to start');
            process.exit(1);
        });
     }catch (err){
        logger.error({err},'Failed to start server');
        process.exit(1);
    }
};

startServer();