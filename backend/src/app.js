const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const pinoHttp = require('pino-http');
const logger = require('./config/logger');
const globalErrorHandler = require('./middlewares/errorHandler');
const AppError = require('./utils/AppError');

dotenv.config();

const app = express();

app.use(pinoHttp({logger}));

//Middleware
app.use(cors());
app.use(express.json());

//Testing error handling
app.get('/test-error', (req, res, next) => {
    next(new AppError('This is a test error', 400));
});

//Route Health Check
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'UP', message: 'server is healthy' });
});

app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

module.exports = app;