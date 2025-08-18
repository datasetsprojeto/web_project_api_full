const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'request.log' }),
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
  ],
});

module.exports = {
  requestLogger: (req, res, next) => {
    logger.info({
      method: req.method,
      url: req.url,
      body: req.body,
    });
    next();
  },
  errorLogger: (err, req, res, next) => {
    logger.error({
      message: err.message,
      stack: err.stack,
    });
    next(err);
  }
};