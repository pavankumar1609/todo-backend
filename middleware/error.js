const logger = require("../loggers/errorLogger");

module.exports = function error(err, req, res, next) {
  logger.log({ level: "error", stack: err.stack });

  res.status(500).send("Internal Server Error.");
};
