const knex = require("knex")({
  client: "pg",
  connections: {
    host: "localhost",
    database: "users",
    username: "postgres",
    password: "Welcome123"
  }
});

module.exports = knex;
