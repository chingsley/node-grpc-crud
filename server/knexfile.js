require("dotenv").config();
const path = require("path");

console.log({
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

module.exports = {
  development: {
    client: "postgresql",
    connection: {
      host: "127.0.0.1",
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      port: "5432",
      database: process.env.DB_NAME,
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      directory: path.join(__dirname, "db", "migrations"),
    },
    seeds: {
      directory: path.join(__dirname, "db", "seeds"),
    },
  },
};
