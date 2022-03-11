const nodemailer = require("nodemailer");

module.exports = async function (to, title, msg) {
  const transporter = nodemailer.createTransport({
    host: process.env.HOST,
    port: 587,
    secure: false,
    auth: {
      user: process.env.USER,
      pass: process.env.PASS,
    },
  });

  await transporter.sendMail({
    from: "Energia Powered",
    to: to,
    subject: title,
    text: msg,
  });
};
