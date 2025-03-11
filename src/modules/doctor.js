const { sequelize } = require("../database/connect");
const { DataTypes } = require("sequelize");

const Doctor = sequelize.define("Doctor", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = Doctor;
