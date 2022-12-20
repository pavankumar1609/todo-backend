const Joi = require("joi");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const usersSchema = new mongoose.Schema({
  email: {
    type: String,
    minlength: 5,
    maxlength: 50,
    unique: true,
    trim: true,
    required: true,
    lowercase: true,
  },
  password: {
    type: String,
    minlength: 5,
    maxlength: 1024,
    trim: true,
    required: true,
  },
  name: {
    type: String,
    minlength: 4,
    maxlength: 50,
    trim: true,
    required: true,
  },
  isAdmin: Boolean,
});

usersSchema.methods.generateAuthToken = function () {
  return jwt.sign(
    { _id: this._id, name: this.name, isAdmin: this.isAdmin },
    process.env.privateKey
  );
};

const User = mongoose.model("User", usersSchema);

const validateUser = (user) => {
  const schema = Joi.object({
    email: Joi.string().email().min(5).max(50).required(),
    password: Joi.string().min(5).max(50).required(),
    name: Joi.string().min(4).max(50).required(),
  });

  return schema.validate(user);
};

module.exports.User = User;
module.exports.validate = validateUser;
