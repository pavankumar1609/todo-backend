const { createLogger, format, transports } = require("winston");
const { printf, combine, timestamp } = format;

const myFormat = printf(({ message, timestamp }) => {
  return `${message}\n${timestamp}\n`;
});

module.exports = createLogger({
  level: "error",
  format: combine(timestamp(), myFormat),
  exceptionHandlers: [
    new transports.Console(),
    new transports.File({ filename: "logs/exceptions.log" }),
  ],
});
