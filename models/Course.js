const Joi = require("joi");
const { Schema, model } = require("mongoose");

const courseSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  instructor: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
    unique: true,
  },
  year: {
    type: Number,
    required: true,
  },
});

// Create model and stored it in Course variable
const Course = model("Course", courseSchema);

// Add course validation schema
const addCourseSchema = Joi.object({
  name: Joi.string().min(3).max(25).required(),
  instructor: Joi.string().min(3).max(25).required(),
  code: Joi.string().length(7).required(),
  year: Joi.number().min(1).max(4).required(),
});

// Update course validation schema
const updateCourseSchema = Joi.object({
  name: Joi.string().min(3).max(25),
  instructor: Joi.string().min(3).max(25),
  code: Joi.string().length(7),
  year: Joi.number().min(1).max(4),
});

module.exports = { Course, addCourseSchema, updateCourseSchema };
