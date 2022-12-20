const logger = require("./loggers/infoLogger");
const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());

require("dotenv").config();
require("./startup/dotenv")(app); //1
require("./loggers/exceptionLogger"); //2
require("./loggers/rejectionLogger"); //2
require("./startup/prod")(app); //3
require("./startup/routes")(app); //4
require("./startup/db")(); //4
require("./startup/config")(); //4
require("./startup/validation")(); //4

const port = process.env.PORT || 9000;
app.listen(port, () => logger.info(`Listening on port ${port}...`));
