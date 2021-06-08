const express = require("express");
const app = express.Router();
const Courses = [];
app.get("/", (req, res) => {
  res.json(Courses);
});

app.get("/:id", (req, res) => {
  const db = req.app.get("db");
  db("user_courses")
    .where({
      COURSEID: req.params.id
    })
    .then(rows => {
      if (rows.length === 1) {
        res.status(200).json(rows);
      } else {
        res.status(404).json("Course not found");
      }
    });
});

app.post("/", (req, res) => {
  const { CName, Description } = req.body;
  const db = req.app.get("db");

  const CreatedOn = new Date();
  const UpdatedOn = null;
  const Deleted = false;

  console.log("session available", req.session.Users);

  db.schema.hasTable("user_courses").then(exists => {
    if (req.session.Users) {
      const Author = req.session.Users.USERNAME;
      //console.log("Author", req.session.Users.USERID);
      if (!exists) {
        db.schema
          .createTable("user_courses", table => {
            table.increments("COURSEID").primary();
            table.string("COURSENAME");
            table.string("AUTHOR");
            table.string("DESCRIPTION");
            table.timestamp("CREATEDDATE").defaultTo(db.fn.now());
            table.timestamp("UPDATEDON").defaultTo(null);
            table.boolean("DELETED").defaultTo(false);
          })
          .then(() => {
            db("user_courses")
              .insert({
                AUTHOR: Author,
                DESCRIPTION: Description,
                COURSENAME: CName
              })
              .then(() => {
                res.status(201).json("NEW COURSE HAS BEEN ADDED");
              });
          });
      } else {
        db("user_courses")
          .where({
            DESCRIPTION: Description,
            COURSENAME: CName
          })
          .then(rows => {
            if (rows.length === 1) {
              res
                .status(409)
                .json(`${CName} Course Already exists Please check !!`);
            } else {
              db("user_courses")
                .insert({
                  AUTHOR: Author,
                  DESCRIPTION: Description,
                  COURSENAME: CName
                })
                .then(() => {
                  res
                    .status(201)
                    .json("NEW COURSE HAS BEEN ADDED SUCCESSFULLY !!");
                });
            }
          });
      }
    } else {
      res.status(401).json("Invalid Session.");
    }
  });
});
// app.put("/:id", () => {});

// app.delete("/:id", () => {
//   const db = req.app.get("db");
//   db("user_courses")
//     .where({
//       COURSEID: req.params.id
//     })
//     .then(rows => {
//       if (rows.length === 1) {
//         res.status(200).json(rows);
//       } else {
//         res.status(404).json("Course not found");
//       }
//     });
// });
module.exports = app;
