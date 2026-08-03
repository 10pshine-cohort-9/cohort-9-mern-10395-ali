const logger = require ('../config/logger');

/**
 * @param {any} err
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
const globalErrorHandler = (err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }

    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    logger.error({
        message: err.message,
        stack: err.stack,
        path: req.originalUrl,
        method: req.method
    });

    if(process.env.NODE_ENV === 'development'){
        return res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
            stack: err.stack
        });
    }

    if(err.isOperational){
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
        });
    }else{
        res.status(500).json({
            status: 'error',
            message: 'something went wrong'
        });
    }
};

module.exports = globalErrorHandler; 