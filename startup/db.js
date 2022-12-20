const logger = require("../loggers/infoLogger");
const mongoose = require("mongoose");

module.exports = async function () {
  await mongoose.connect(process.env.db);
  logger.info(`connected to ${process.env.db}`);
};
