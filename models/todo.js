const Joi = require("joi");
const mongoose = require("mongoose");

const todoSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  title: {
    type: String,
    minlength: 5,
    maxlength: 255,
    required: true,
    trim: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
});

const Todo = mongoose.model("Todo", todoSchema);

const validateTodo = (todo) => {
  const schema = Joi.object({
    userId: Joi.objectId().required(),
    title: Joi.string().min(5).max(255).required(),
    completed: Joi.bool(),
  });

  return schema.validate(todo);
};

module.exports.Todo = Todo;
module.exports.validate = validateTodo;
