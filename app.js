const express = require("express");
const mongoose = require("mongoose");
const users = require("./routes/users"); // impor users route
require("dotenv").config();

const app = express();

const port = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/users", users);

// log any error caused when connect to database
main().catch((err) => console.log(err));

// connect to database
async function main() {
  await mongoose.connect(process.env.DB_URI);
  console.log("***connected to mongodb***");
}

app.get("/", (req, res) => {
  res.send("Hello000000000");
});

app.listen(port, () => {
  console.log("listening to port 3000");
});
