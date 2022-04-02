// Putting the variable in {} is equivalent to: const Schema = require('mongoose').Schema
const Joi = require("joi");
const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  fullName: {
    type: String,
    required: true,
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
  birthDate: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    enum: ["Male", "Female"],
    required: true,
  },
  highSchoolName: {
    type: String,
    required: true,
  },
  grade: {
    type: Number,
    required: true,
    unique: true,
  },
  graduationYear: {
    type: Number,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    required: true,
    default: false,
  },
  isVerified: {
    type: Boolean,
    required: true,
    default: false,
  },
  courses: [
    {
      type: Schema.Types.ObjectId,
      ref: "Course",
    },
  ],
});

// Create model and stored it in User variable
const User = model("User", userSchema);

// Sign up validation schema
const registerSchema = Joi.object({
  fullName: Joi.string().min(3).max(25).required(),
  email: Joi.string().email().required(),
  password: Joi.string().alphanum().min(8).max(16).required(),
  password2: Joi.string()
    .valid(Joi.ref("password"))
    .required()
    .messages({ "any.only": "Passwords don't match" }),
  birthDate: Joi.date().required(),
  gender: Joi.string().valid("Male", "Female"),
  highSchoolName: Joi.string().min(3).max(25).required(),
  grade: Joi.number().min(0).max(100).required(),
  graduationYear: Joi.number().min(2015).max(2021).required(),
});

// Log in validation schema
const logInSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().alphanum().min(8).max(16).required(),
});

// Update user validation schema
const updateUserSchema = Joi.object({
  fullName: Joi.string().min(3).max(25),
  email: Joi.string().email(),
  birthDate: Joi.date(),
  gender: Joi.string().valid("Male", "Female"),
  highSchoolName: Joi.string().min(3).max(25),
  grade: Joi.number().min(0).max(100),
  graduationYear: Joi.number().min(2015).max(2021),
});

module.exports = { User, registerSchema, logInSchema, updateUserSchema };
