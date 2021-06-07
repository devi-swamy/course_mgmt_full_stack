const express = require("express");
const app = express.Router();
const users = require("./api/users");
const courses = require("./api/courses");

app.get("/", (req, res) => {
  console.log("user inserted");
  res.json("api get");
});

app.use("/users", users);
app.use("/courses", courses);

module.exports = app;
