const { Course } = require("../models/Course");
const { User } = require("../models/User");

module.exports = {
  enrollCourse: async (req, res) => {
    try {
      const { course_code } = req.params;
      const userId = req.userId;

      const course = await Course.findOne({ code: course_code });

      if (!course) {
        return res.sendStatus(404);
      }

      await User.updateOne({ _id: userId }, { $push: { courses: course._id } });

      return res
        .status(200)
        .json({ message: "Enrolled to the course successfully" });
    } catch (error) {
      return res.status(500).json(error);
    }
  },

  unenrollCourse: async (req, res) => {
    try {
      const { course_code } = req.params;
      const userId = req.userId;

      const course = await Course.findOne({ code: course_code });

      if (!course) {
        return res.sendStatus(404);
      }

      const { courses: userCourses } = await User.findById(userId).populate(
        "courses"
      );

      const filteredCourses = userCourses.filter(
        (course) => course.code !== course_code
      );

      await User.updateOne({ _id: userId }, { courses: filteredCourses });

      return res
        .status(200)
        .json({ message: "Unenrolled from the course successfully" });
    } catch (error) {
      return res.status(500).json(error);
    }
  },
};
