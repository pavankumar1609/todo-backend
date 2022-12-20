require("winston-mongodb");
const { createLogger, transports, format } = require("winston");
const { combine, timestamp, prettyPrint, metadata } = format;

module.exports = createLogger({
  level: "error",
  format: combine(timestamp(), prettyPrint(), metadata()),
  transports: [
    new transports.Console(),
    new transports.File({ filename: "logs/errors.log" }),
    new transports.MongoDB({
      db: process.env.db,
      options: { useUnifiedTopology: true },
    }),
  ],
});
