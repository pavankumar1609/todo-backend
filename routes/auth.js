const Joi = require("joi");
const bcrypt = require("bcrypt");
const express = require("express");
const router = express.Router();
const validator = require("../middleware/validator");
const { User } = require("../models/user");

router.post("/", [validator(validateAuth)], async (req, res) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) return res.status(400).send("Invalid email or password");

  const valid = await bcrypt.compare(req.body.password, user.password);
  if (!valid) return res.status(400).send("Invalid email or password");

  const token = user.generateAuthToken();

  res.send(token);
});

function validateAuth(user) {
  const schema = Joi.object({
    email: Joi.string().email().min(5).max(50).required(),
    password: Joi.string().min(5).max(500).required(),
  });

  return schema.validate(user);
}

module.exports = router;
