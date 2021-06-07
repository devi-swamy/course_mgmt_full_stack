const express = require("express");
const session = require("express-session");
const morgan = require("morgan");
const cors = require("cors");

const m_session = session({
  secret: "keyboard cat",
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
});

const m_json = express.json();
const m_morg = morgan("dev");
const m_cors = cors();
const m_urled = express.urlencoded({
  extended: true
});

module.exports = [m_session, m_json, m_morg, m_cors, m_urled];
