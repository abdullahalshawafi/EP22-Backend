const { Schema, model } = require("mongoose");

const tokenSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
});

const token = model("Token", tokenSchema);

module.exports = token;
