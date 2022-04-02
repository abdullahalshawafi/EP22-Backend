const verifyEmail = require("../helpers/emailVerification");
const { parseErrorMessages } = require("../helpers/validationErrors");
const { User, updateUserSchema } = require("../models/User");

module.exports = {
  getUserById: async (req, res) => {
    try {
      const { id } = req.params;

      const user = await User.findById(
        id,
        "-__v -password -isAdmin -isVerified"
      ).populate("courses", "-_id -__v");

      if (!user) {
        return res.sendStatus(404);
      }

      res.status(200).json({ user });
    } catch (error) {
      res.status(500).json({ error });
    }
  },

  updateUserById: async (req, res) => {
    const { error } = updateUserSchema.validate(req.body);

    if (error) {
      const errorObject = parseErrorMessages(error.details);
      return res.status(422).json(errorObject);
    }

    try {
      const { id } = req.params;

      let loggedInUser = await User.findById(id); // logged in user

      let user = await User.findOne({ email: req.body.email }); // body email

      // Check if the email is updated
      if (loggedInUser.email !== req.body.email) {
        // If the email was already taken then don't update
        if (user) {
          return res.status(400).json({ error: "Email is already taken" });
        }

        req.body.isVerified = false;
        user = await User.findByIdAndUpdate(id, req.body, { new: true });

        await verifyEmail(user);
      } else {
        await User.updateOne({ _id: id }, req.body);
      }

      return res.status(200).json({ message: "User updated successfully" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error });
    }
  },
};
