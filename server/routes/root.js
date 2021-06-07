const express = require("express");
const app = express.Router();
const api = require("./api");

app.get("/", (req, res) => {
  console.log(res.json("Hello Worlddd"));
});

app.use("/api", api);

module.exports = app;
