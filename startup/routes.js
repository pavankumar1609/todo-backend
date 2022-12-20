require("express-async-errors");
const todos = require("../routes/todos");
const users = require("../routes/users");
const auth = require("../routes/auth");
const error = require("../middleware/error");
const express = require("express");

module.exports = function (app) {
  app.use(express.json());
  app.use("/api/auth", auth);
  app.use("/api/todos", todos);
  app.use("/api/users", users);
  app.use(error);
};
