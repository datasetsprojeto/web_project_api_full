const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/request.log' }),
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
  ],
});

// Criar logs directory se não existir
const fs = require('fs');
const path = require('path');
const logsDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

module.exports = {
  requestLogger: (req, res, next) => {
    logger.info({
      timestamp: new Date().toISOString(),
      method: req.method,
      url: req.url,
      query: req.query,
      params: req.params,
      ip: req.ip,
      userAgent: req.get('User-Agent')
    });
    next();
  },
  errorLogger: (err, req, res, next) => {
    logger.error({
      timestamp: new Date().toISOString(),
      message: err.message,
      stack: err.stack,
      url: req.url,
      method: req.method,
      ip: req.ip
    });
    next(err);
  }
};