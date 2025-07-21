const { Sequelize } = require("sequelize");
const path = require("path");
const fs = require("fs");

const dbPath = path.resolve(__dirname, "..", "data", "database.sqlite");
const dataDir = path.resolve(__dirname, "..", "data");
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: dbPath,
  logging: false,
});

// Optional: Test the connection
sequelize
  .authenticate()
  .then(() => {
    console.log("SQLite connection has been established successfully.");
  })
  .catch((err) => {
    console.error("Unable to connect to the SQLite database:", err);
  });

module.exports = sequelize;
