module.exports = function (req, res, next) {
  if (req.params.username !== req.payload.username) {
    return res.status(403).json({ error: "This is out of your business" });
  }

  next();
};
