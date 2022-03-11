//putting the varible in {} is equivalent to: const Schema = require('mongose').Schema
const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  phone: {
    type: Number,
    required: true,
    unique: true,
  },
  age: {
    type: Number,
    required: true,
  },
  verified: {
    type: Boolean,
    required: true,
    default: false,
  },
});

//create model and stored it in User variable
const User = model("User", userSchema);

//export User model to import whenever i want
module.exports = User;
