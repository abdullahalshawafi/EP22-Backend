const router = require("express").Router();
const usersController = require("../controllers/users");
const mine = require("../middleware/mine");

// Get a user with given id
router.get("/:id", mine, usersController.getUserById);

// Update user's info with the given id
router.put("/:id", mine, usersController.updateUserById);

module.exports = router;
