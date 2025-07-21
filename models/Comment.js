const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./User");
const Post = require("./Post");

const Comment = sequelize.define("Comment", {
  content: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  commentableId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  commentableType: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

Comment.belongsTo(User); // User can have many Comments

module.exports = Comment;
