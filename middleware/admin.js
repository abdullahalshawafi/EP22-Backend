const { User } = require("../models/User");

module.exports = async function (req, res, next) {
  try {
    const user = await User.findById(req.userId);

    if (!user.isAdmin) {
      return res.status(403).json({ error: "Access denied" });
    }

    next();
  } catch (error) {
    res.status(500).json({ error });
  }
};
