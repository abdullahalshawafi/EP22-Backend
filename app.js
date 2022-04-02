const express = require("express");
const mongoose = require("mongoose");
const auth = require("./middleware/auth");
const verified = require("./middleware/verified");

require("dotenv").config();

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/auth", require("./routes/auth"));
app.use("/users", [auth, verified], require("./routes/users"));
app.use("/courses", require("./routes/courses"));

// log any error caused when connect to database
db().catch((err) => console.log(err));

// connect to database
async function db() {
  await mongoose.connect(process.env.DB_URI);
  console.log("**connected to db**");
}

app.get("/", (req, res) => {
  res.send("Welcome to our Collage System API");
});

app.listen(PORT, () => {
  console.log(`Server started listening at port ${PORT}`);
});
