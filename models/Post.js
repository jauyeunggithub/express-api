const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./User");

const Post = sequelize.define("Post", {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
});

Post.belongsTo(User); // User can have many Posts

module.exports = Post;
