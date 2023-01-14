const { DataTypes } = require("sequelize");
const { createDB } = require("../config/db");

const User = createDB.define("user-db", {
  id: {
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
    type: DataTypes.INTEGER,
  },
  name: {
    allowNull: false,
    type: DataTypes.STRING,
  },
  email: {
    allowNull: false,
    type: DataTypes.STRING,
  },
  password: {
    allowNull: false,
    type: DataTypes.STRING,
  },
  token: DataTypes.STRING,
});

module.exports = User;
