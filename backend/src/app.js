const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const pinoHttp = require('pino-http');
const crypto = require('crypto');
const logger = require('./config/logger');
const routes = require('./routes');
const globalErrorHandler = require('./middlewares/errorHandler');
const AppError = require('./utils/AppError');

dotenv.config();

const app = express();

app.use(pinoHttp({ 
  logger,
  genReqId: (req) => req.headers['x-request-id'] || crypto.randomUUID()
}));

app.use(cors());
app.use(express.json());

app.use('/api', routes);

app.all('/{*path}', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

module.exports = app;