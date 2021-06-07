const express = require("express");
const app = express.Router();

const db = require("../../db"); // importing db configurations
//app.set("db", db);

const Users = [];

app.get("/", (req, res) => {
  res.json("inside the users get");
});

app.post("/signup", (req, res) => {
  const { Fullname, Email, Password } = req.body;
  const db = req.app.get("db");
  db.schema.hasTable("users").then(exists => {
    if (!exists) {
      console.log("table not exists and going to create one");
      db.schema
        .createTable("users", table => {
          table.increments("USERID").primary();
          table.string("FULLNAME");
          table.string("EMAIL");
          table.string("PASSWORD");
          table.timestamp("CREATEDDATE").defaultTo(db.fn.now());
        })
        .then(() =>
          db("users")
            .insert({
              EMAIL: Email,
              FULLNAME: Fullname,
              PASSWORD: Password
            })
            .then(() => {
              console.log("rows inserted");
              res.status(201);
            })
        );
    } else {
      console.log("user table exists");
      db("users")
        .where({ EMAIL: Email })
        .then(rows => {
          const MatchedEmail = rows;
          console.log("checking for signup cn", MatchedEmail);

          if (!MatchedEmail) {
            console.log("User Registering for the first time");
            db("users")
              .insert({
                EMAIL: Email,
                FULLNAME: Fullname,
                PASSWORD: Password
              })
              .then(() => {
                res.status(201).json("User Registered Successfully");
                console.log("rows inserted from else con");
                //res.status(201);
              });
          } else {
            res.status(409).json("user Already exists");
            console.log("user Already exists");
          }
        });
    }
  });
});

app.post("/signin", (req, res) => {
  const { Email, Password } = req.body;
  //Database validation
  const db = req.app.get("db");
  db.schema.hasTable("users").then(exists => {
    console.log("database users exists");
    if (exists) {
      db("users")
        .where({ EMAIL: Email, PASSWORD: Password })
        .then(rows => {
          if (rows.length === 1) {
            console.log("Record exists");
            res.status("200").json("Row fetched");
          } else {
            res.status("403").json("Unable to verify the details.");
          }
        });
    } else {
      console.log("DB does not exists");
      //res.status("404").json("User Account not available");
    }
  });
});

module.exports = app;
