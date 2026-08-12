const pino = require('pino');

const transport = pino.transport({
  target: 'pino-pretty',
  options: {
    colorize: true,
    translateTime: 'SYS:standard',
    ignore: 'pid,hostname',
  },
});

// FIX: Disable logging if the environment is 'test'
const logger = pino(
  process.env.NODE_ENV === 'test' 
    ? { enabled: false } 
    : (process.env.NODE_ENV === 'production' ? {} : transport)
);

module.exports = logger;