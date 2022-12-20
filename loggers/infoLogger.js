const { createLogger, transports, format } = require("winston");

module.exports = createLogger({
  level: "info",
  format: format.simple(),
  transports: [
    new transports.Console(),
    new transports.File({
      filename: "logs/info.log",
    }),
  ],
});
