const { createLogger, format, transports } = require("winston");

const logger = createLogger({
    level: "debug", // Set the default log level
    format: format.combine(format.timestamp({ format: "DD-MM-YYYY HH:mm:ss" })),
    transports: [
        new transports.Console({
            format: format.combine(
                format.colorize(),
                format.printf(info => `${info.timestamp} [${info.level}]: ${info.message}`),
            ),
        }),
    ],
});

module.exports = logger;
