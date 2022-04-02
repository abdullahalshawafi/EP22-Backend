const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Token = require("../models/Token");
const verifyEmail = require("../helpers/emailVerification");
const { parseErrorMessages } = require("../helpers/validationErrors");
const { User, registerSchema, logInSchema } = require("../models/User");

module.exports = {
  registerController: async function (req, res) {
    const { error } = registerSchema.validate(req.body, { abortEarly: false });

    if (error) {
      const errorObject = parseErrorMessages(error.details);
      return res.status(422).json(errorObject);
    }

    try {
      const { email, password } = req.body;

      let user = await User.findOne({ email });

      if (user) {
        return res.status(400).json({ error: "Email is already taken" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      user = await new User({ ...req.body, password: hashedPassword });

      await verifyEmail(user);

      await user.save();

      res.status(201).json({ message: "User created successfully" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error });
    }
  },

  loginController: async function (req, res) {
    const { error } = logInSchema.validate(req.body);

    if (error) {
      const errorObject = parseErrorMessages(error.details);
      return res.status(422).json(errorObject);
    }

    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email });

      if (!user) {
        return res.status(400).json({ error: "Invalid email or password" });
      }

      const isValid = await bcrypt.compare(password, user.password);

      if (!isValid) {
        return res.status(400).json({ error: "Invalid email or password" });
      }

      if (!user.isVerified) {
        return res.status(403).json({ error: "Please verify your email" });
      }

      const token = jwt.sign({ id: user._id }, process.env.JWT_PRIVATE_KEY);

      res.status(200).json({ message: "Logged in successfully", token });
    } catch (error) {
      res.status(500).json({ error });
    }
  },

  verifyController: async function (req, res) {
    try {
      const token = await Token.findOne({ token: req.params.token });

      if (!token) {
        return res.status(400).json({ error: "Invalid token" });
      }

      if (token.userId.toString() !== req.params.id) {
        return res.status(400).json({ error: "Invalid token" });
      }

      await User.findByIdAndUpdate(token.userId, { isVerified: true });

      await Token.deleteOne({ token: req.params.token });

      res.status(200).json({ message: "User verified successfully" });
    } catch (error) {
      res.status(500).json({ error });
    }
  },
};
