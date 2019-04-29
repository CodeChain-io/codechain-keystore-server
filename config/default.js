const path = require("path");

module.exports = {
  knex: {
    client: "pg",
    connection: {
      host: "localhost",
      port: 5432,
      database: "codechain-keystore",
      user: "codechain"
    },
    migrations: {
      directory: path.resolve(__dirname, "..", "migrations"),
      tableName: "knex"
    },
    seeds: {
      directory: path.resolve(__dirname, "..", "seeds")
    }
  },
};
