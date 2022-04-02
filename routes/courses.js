const router = require("express").Router();
const userCoursesController = require("../controllers/userCourses");
const coursesController = require("../controllers/courses");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const verified = require("../middleware/verified");

// Get all courses
router.get("/", coursesController.getAllCourses);

// Enroll to a course
router.put(
  "/:course_code/enroll",
  [auth, verified],
  userCoursesController.enrollCourse
);

// Unenroll from a course
router.put(
  "/:course_code/unenroll",
  [auth, verified],
  userCoursesController.unenrollCourse
);

// Add new course to the database
router.post("/add", [auth, verified, admin], coursesController.addCourse);

// Update course's info with the given course code
router.put(
  "/:course_code/edit",
  [auth, verified, admin],
  coursesController.updateCourse
);

// Delete the course with the given course code
router.delete(
  "/:course_code/delete",
  [auth, verified, admin],
  coursesController.deleteCourse
);

// Delete all courses
router.delete("/", [auth, verified, admin], coursesController.deleteAllCourses);

module.exports = router;
