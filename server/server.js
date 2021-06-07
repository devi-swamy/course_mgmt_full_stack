const express = require("express");
const middlewares = require("./middleware");
const app = express();
const root = require("./routes/root");

//Handling session
app.set("trust proxy", 1); // trust first proxy
app.use(middlewares);
app.use("/", root);
app.listen(3001, () => "Server Started Listening");
