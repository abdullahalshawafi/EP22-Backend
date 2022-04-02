const { User } = require("../models/User");

module.exports = async function (req, res, next) {
  try {
    const user = await User.findById(req.userId);

    if (!user.isVerified) {
      return res.status(403).json({ error: "Please verify you email" });
    }

    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
};
