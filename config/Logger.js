const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, printf } = format;

var options = {
    console: {
        level: 'silly',
        handleExceptions: true,
        json: false,
        colorize: true
    }
}

const myFormat = printf(({ level, message, timestamp }) => {
    return `[${timestamp}] ${level} : ${message}`;
})

const logger = new createLogger({
    format: combine(
        timestamp(),
        myFormat
    ),
    level: 'info',
    transports: [
        new transports.Console(options.console)
    ]
});

module.exports = logger;