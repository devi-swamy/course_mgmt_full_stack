const express = require("express");
const app = express.Router();

const Users = [];

app.get("/", (req, res) => {
  res.json(req.body.Fullname);
});

app.post("/", (req, res) => {
  const { Fullname, Username, Email, Password } = req.body;
  console.log(Fullname, Email, Password, Username);
  const db = req.app.get("db");
  console.log("DBBBBBBBBBBBB");
  db.schema.hasTable("users").then(exists => {
    if (!exists) {
      console.log("table not exists and going to create one");
      db.schema
        .createTable("users", table => {
          table.increments("USERID").primary();
          table.string("FULLNAME");
          table.string("USERNAME").unique().notNullable();
          table.string("EMAIL").unique().notNullable();
          table.string("PASSWORD");
          table.timestamp("CREATEDDATE").defaultTo(db.fn.now());
        })
        .then(() =>
          db("users")
            .insert({
              EMAIL: Email,
              FULLNAME: Fullname,
              USERNAME: Username,
              PASSWORD: Password
            })
            .then(() => {
              console.log("rows inserted");
              res.status(201).json("User Registered");
            })
        );
    } else {
      console.log("user table exists");
      console.log(Fullname, Email, Password);
      db("users")
        .where({ EMAIL: Email, USERNAME: Username })
        .then(rows => {
          const MatchedEmail = rows.find(
            row => row.EMAIL === Email && row.USERNAME === Username
          );
          console.log("checking for signup cn", MatchedEmail);

          if (!MatchedEmail) {
            console.log("User Registering for the first time");
            db("users")
              .insert({
                EMAIL: Email,
                FULLNAME: Fullname,
                USERNAME: Username,
                PASSWORD: Password
              })
              .then(() => {
                res.status(201).json("User Registered Successfully");

                console.log("rows inserted from else con");
                //res.status(201);
              });
          } else {
            res.status(409).json("user Already exists");
            console.log("user Already existsss");
          }
        });
    }
  });
});

app.post("/signin", (req, res) => {
  const { Email, Password, Username } = req.body;
  //Database validation
  const db = req.app.get("db");
  db.schema.hasTable("users").then(exists => {
    console.log("database users exists");
    if (exists) {
      db("users")
        .where({ EMAIL: Email, PASSWORD: Password })
        .then(rows => {
          const MatchedUser = rows.find(
            User => User.EMAIL === Email && User.PASSWORD === Password
          );
          if (MatchedUser) {
            console.log("Record exists", rows);
            req.session.Users = MatchedUser;
            console.log("users session", req.session.Users.USERNAME);
            res.status("200").json("Row fetched");
          } else {
            req.session.destroy();
            res.status("403").json("Unable to verify the details.");
          }
        });
    } else {
      console.log("DB does not exists");
      //res.status("404").json("User Account not available");
    }
  });
});
app.delete("/logout", (req, res) => {
  req.session.destroy();
  console.log("logged out");
  res.status("204").end();
});
module.exports = app;
