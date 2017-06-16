const winston = require('winston');

class Log {
  constructor() {
    winston.configure({
      transports: [
        new (winston.transports.File)({ filename: 'debug.log' }),
      ],
    });
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new Log();
    }

    return this.instance;
  }

  info(tag, message) {
    winston.info(`[${tag}] ${message}`);
  }
}

module.exports = Log;
