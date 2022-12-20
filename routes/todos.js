const _ = require("lodash");
const express = require("express");
const router = express.Router();
const { Todo, validate } = require("../models/todo");
const validator = require("../middleware/validator");
const auth = require("../middleware/auth");
const validateId = require("../middleware/idValidator");
const admin = require("../middleware/admin");

router.get("/", [auth, admin], async (req, res) => {
  const todos = await Todo.find({ userId: { $ne: req.user._id } }).select(
    "-__v"
  );

  res.send(todos);
});

router.get("/:id", [validateId, auth], async (req, res) => {
  if (!req.user.isAdmin && req.user._id !== req.params.id)
    return res.status(403).send("Access denied");

  let todos = await Todo.find({ userId: req.params.id }).select("-__v");

  if (todos.length === 0) return res.status(404).send("Todos not found");

  res.send(todos);
});

router.post("/", [validator(validate), auth], async (req, res) => {
  if (req.user._id !== req.body.userId)
    return res.status(404).send("Invalid user");

  const todo = await Todo.create({
    title: req.body.title,
    userId: req.body.userId,
  });

  res.send(_.pick(todo, ["_id", "userId", "title", "completed"]));
});

router.put(
  "/:id",
  [validateId, validator(validate), auth],
  async (req, res) => {
    if (req.user._id !== req.body.userId)
      return res.status(404).send("Invalid user");

    const todo = await Todo.findOne({
      _id: req.params.id,
      userId: req.body.userId,
    }).select("-__v");

    if (!todo) return res.status(404).send("Todo not found");

    todo.title = req.body.title;
    if ("completed" in req.body) todo.completed = req.body.completed;

    await todo.save();

    res.send(todo);
  }
);

router.delete("/:id", [validateId, auth], async (req, res) => {
  const todo = await Todo.findById(req.params.id).select("-__v");

  if (!todo) return res.status(404).send("Todo not found");

  if (!req.user.isAdmin && req.user._id !== todo.userId.toString())
    return res.status(403).send("Access denied");

  await todo.remove();

  res.send(todo);
});

module.exports = router;
