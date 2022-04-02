const router = require("express").Router();
const authController = require("../controllers/auth");

// Add new user to the database
router.post("/register", authController.registerController);

// User login
router.post("/login", authController.loginController);

// Verify user's email
router.get("/verify/:token/:id", authController.verifyController);

module.exports = router;
