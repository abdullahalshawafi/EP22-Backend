const router = require("express").Router();
const Joi = require("joi");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("../models/User");
const Token = require("../models/Token");
const auth = require("../middleware/auth");
const mine = require("../middleware/mine");
const sendMail = require("../helpers/mailer");

const signUpSchema = Joi.object({
  email: Joi.string().email().required(),
  pw1: Joi.string().alphanum().min(8).max(16).required(),
  pw2: Joi.ref("pw1"),
  username: Joi.string().min(3).max(30).required(),
  age: Joi.number().min(13).required(),
  phone: Joi.number().required(),
});

const signInSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().alphanum().min(8).max(16).required(),
});

const updateUserSchema = Joi.object({
  email: Joi.string().email(),
  password: Joi.string().alphanum().min(8).max(16),
  username: Joi.string().min(3).max(30),
  age: Joi.number().min(13),
  phone: Joi.number(),
}).oxor("username", "password");

//get all users
router.get("/", async (req, res) => {
  try {
    //store all users in the database in a variable
    const users = await User.find();

    res.status(200).json({ users });
  } catch (err) {
    res.status(500).json({ err });
  }
});

//get a user with given username
router.get("/:username", auth, mine, async (req, res) => {
  try {
    const { username } = req.params;

    const user = await User.findOne({ username });

    if (!user) {
      return res.sendStatus(404);
    }

    res.status(200).json({ user });
  } catch (err) {
    res.status(500).json({ err });
  }
});

// add user to the database
router.post("/signup", async (req, res) => {
  const { error } = signUpSchema.validate(req.body, { abortEarly: false });

  if (error) {
    const errorObject = {};
    error.details.forEach((err) => {
      errorObject[err.path[0]] = err.message;
    });
    console.log(errorObject);
    return res.status(422).json(errorObject);
  }

  try {
    const { username, email, pw1, pw2, age, phone } = req.body;

    const takenUsername = await User.findOne({ username });

    // check whether the username is taken or not
    if (takenUsername) {
      return res.status(400).json({ error: "username is taken" });
    }

    if (pw1 !== pw2) {
      return res.status(400).json({ error: "passwords don't match" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(pw1, salt);

    await new User({ username, email, password: hashed, age, phone }).save();

    const token = jwt.sign({ email, username }, process.env.JWT_PRIVATE_KEY);

    const emailToken = crypto.randomBytes(32).toString("hex");

    await new Token({ username, token: emailToken }).save();

    const link = `${process.env.BASE_URL}/users/verify/${emailToken}/${username}`;

    await sendMail(
      email,
      "Energia Powered | Verify Email",
      `Welcome to Energia Powered\nPlease verify your email via the following link:\n${link}`
    );

    res
      .status(201)
      .header("x-auth-token", token)
      .json({ message: "user created successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error });
  }
});

router.get("/verify/:token/:username", async (req, res) => {
  try {
    const token = await Token.findOne({ token: req.params.token });

    if (!token) {
      return res.status(400).json({ error: "Invalid token" });
    }

    if (token.username !== req.params.username) {
      return res.status(400).json({ error: "Invalid token" });
    }

    await User.findOneAndUpdate(
      { username: token.username },
      { verified: true }
    );

    await Token.deleteOne({ token: req.params.token });

    res.status(200).json({ message: "User verified successfully" });
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

//user signin
router.post("/signin", async (req, res) => {
  const { error } = signInSchema.validate(req.body);

  if (error) {
    const errorObject = {};
    error.details.forEach((err) => {
      errorObject[err.path[0]] = err.message;
    });
    console.log(errorObject);
    return res.status(422).json(errorObject);
  }

  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    const isValid = await bcrypt.compare(password, user.password);

    if (user && isValid) {
      res
        .status(200)
        .header(
          "x-auth-token",
          jwt.sign(
            { email: user.email, username: user.username },
            process.env.JWT_PRIVATE_KEY
          )
        )
        .json({ message: "sign in successfully" });
    } else {
      res.status(400).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ error });
  }
});

//update user's info with the given username
router.put("/:username", auth, mine, async (req, res) => {
  const { error } = updateUserSchema.validate(req.body);

  if (error) {
    const errorObject = {};
    error.details.forEach((err) => {
      errorObject[err.path[0]] = err.message;
    });
    console.log(errorObject);
    return res.status(422).json(errorObject);
  }

  try {
    let user = await User.findOne({ username: req.body.username }); // body username

    // Check if the username is updated
    // If the username was already taken then don't update
    if (req.params.username !== req.body.username && user) {
      return res.status(400).json({ error: "Username is already taken" });
    }

    user = await User.findOne({ username: req.params.username }); // params username

    if (!user) {
      return res.sendStatus(404);
    }

    await User.updateOne({ username: req.params.username }, req.body);

    return res
      .status(200)
      .header(
        "x-auth-token",
        jwt.sign(
          { email: req.body.email, username: req.body.username },
          process.env.JWT_PRIVATE_KEY
        )
      )
      .json({ message: "User updated successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error });
  }
});

//delete the user with the given username
router.delete("/:username", auth, mine, async (req, res) => {
  try {
    const { deletedCount } = await User.deleteOne({
      username: req.params.username,
    });

    if (!deletedCount) {
      return res.status(400).json({ error: "No user with that username" });
    }

    return res.status(200).json({ message: "User deleted" });
  } catch (error) {
    return res.status(500).json({ error });
  }
});

module.exports = router;
