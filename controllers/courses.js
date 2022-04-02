const {
  Course,
  addCourseSchema,
  updateCourseSchema,
} = require("../models/Course");
const { parseErrorMessages } = require("../helpers/validationErrors");

module.exports = {
  getAllCourses: async (req, res) => {
    try {
      const courses = await Course.find({}, "-_id -__v").sort({
        year: 1,
        code: 1,
      });

      res.status(200).json({ courses });
    } catch (err) {
      res.status(500).json({ err });
    }
  },

  addCourse: async (req, res) => {
    const { error } = addCourseSchema.validate(req.body, { abortEarly: false });

    if (error) {
      const errorObject = parseErrorMessages(error.details);
      return res.status(422).json(errorObject);
    }

    try {
      const { code } = req.body;

      const course = await Course.findOne({ code });

      if (course) {
        return res.status(400).json({ error: "Course code is already taken" });
      }

      await new Course(req.body).save();

      res.status(201).json({ message: "Course created successfully" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error });
    }
  },

  updateCourse: async (req, res) => {
    const { error } = updateCourseSchema.validate(req.body);

    if (error) {
      const errorObject = parseErrorMessages(error.details);
      return res.status(422).json(errorObject);
    }

    try {
      const { course_code } = req.params;

      let course = await Course.findOne({ code: course_code }); // params course code

      if (!course) {
        return res.sendStatus(404);
      }

      course = await Course.findOne({ code: req.body.code }); // body course code

      // Check if the course code is updated
      // If the course code was already taken then don't update
      if (course_code !== req.body.code && course) {
        return res.status(400).json({ error: "Course code is already taken" });
      }

      await Course.updateOne({ code: course_code }, req.body);

      return res.status(200).json({ message: "Course updated successfully" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error });
    }
  },

  deleteCourse: async (req, res) => {
    try {
      const { course_code } = req.params;

      const course = await Course.findOneAndDelete({ code: course_code });

      if (!course) {
        return res.sendStatus(404);
      }

      return res.status(200).json({ message: "Course deleted successfully" });
    } catch (error) {
      return res.status(500).json({ error });
    }
  },

  deleteAllCourses: async (req, res) => {
    try {
      await Course.deleteMany({});

      return res
        .status(200)
        .json({ message: "All courses are deleted successfully" });
    } catch (error) {
      return res.status(500).json({ error });
    }
  },
};
