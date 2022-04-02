const { Schema, model, types } = require("mongoose");

const tokenSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
});

const token = model("Token", tokenSchema);

module.exports = token;
