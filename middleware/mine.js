module.exports = function (req, res, next) {
  if (req.params.id !== req.userId) {
    return res.status(403).json({ error: "You can't view other users data" });
  }

  next();
};
