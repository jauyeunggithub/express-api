const { Sequelize } = require("sequelize");
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: process.env.DB_PATH || "./db.sqlite",
});

module.exports = sequelize;
