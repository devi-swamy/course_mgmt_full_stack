const express = require("express");
const app = express();
const session = require("express-session");
const morgan = require("morgan");
const cors = require("cors");
const db = require("./db");

app.set("db", db);
console.log(db);

app.use("/", (req, res) => {
  console.log("started");
  res.json("hello world");
});

app.listen(3001, () => "Server Started Listening");
