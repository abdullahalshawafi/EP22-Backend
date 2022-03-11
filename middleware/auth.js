const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  const token = req.header("x-auth-token");
  if (!token) {
    return res.status(400).json({ error: "where is the token?" });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
    req.payload = payload;
    next();
  } catch (err) {
    console.log(err);
    res.status(400).json({ error: "invalid token" });
  }
};
