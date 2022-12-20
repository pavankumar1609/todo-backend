const bcrypt = require("bcrypt");
const _ = require("lodash");
const express = require("express");
const router = express.Router();
const { User, validate } = require("../models/user");
const { Todo } = require("../models/todo");
const validator = require("../middleware/validator");
const validateId = require("../middleware/idValidator");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const mongoose = require("mongoose");

router.get("/me", [auth], async (req, res) => {
  const user = await User.findById(req.user._id).select("-__v -password");

  res.send(user);
});

router.get("/", [auth, admin], async (req, res) => {
  let users = await User.find({ isAdmin: { $ne: true } }).select({
    __v: 0,
    password: 0,
  });

  res.send(users);
});

router.post("/", [validator(validate)], async (req, res) => {
  let user = await User.findOne({ email: req.body.email });

  if (user) return res.status(400).send("User is already exist");

  user = new User(_.pick(req.body, ["email", "name", "password"]));
  user.password = await bcrypt.hash(req.body.password, 10);
  await user.save();

  const token = user.generateAuthToken();

  res
    .header("x-auth-token", token)
    .header("access-control-expose-headers", "x-auth-token")
    .send(_.pick(user, ["_id", "email", "name"]));
});

router.delete("/:id", [validateId, auth, admin], async (req, res) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const user = await User.findByIdAndDelete(req.params.id, {
      session,
    }).select({
      __v: 0,
      password: 0,
    });

    if (!user) return res.status(404).send("User not found");

    await Todo.deleteMany({ userId: user._id }, { session });

    await session.commitTransaction();

    res.send(user);
  } catch (error) {
    await session.abortTransaction();

    throw error;
  } finally {
    await session.endSession();
  }
});

module.exports = router;
