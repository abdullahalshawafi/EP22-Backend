const crypto = require("crypto");
const Token = require("../models/Token");
const mailer = require("./mailer");

module.exports = async function (user) {
  let token = crypto.randomBytes(32).toString("hex");

  token = await new Token({ userId: user._id, token });

  const link = `${process.env.BASE_URL}/auth/verify/${token.token}/${user._id}`;

  await mailer(
    user.email,
    "Email Verification",
    `Welcome to our college system\nPlease verify your email via the following link:\n${link}`
  );

  await token.save();
};
