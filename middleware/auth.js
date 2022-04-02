const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  const token = req.header("x-auth-token");

  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    const { id: userId } = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
    req.userId = userId;
    next();
  } catch (err) {
    console.log(err);
    res.status(401).json({ error: "Invalid token" });
  }
};
