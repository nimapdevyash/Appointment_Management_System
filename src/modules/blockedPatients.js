const { sequelize } = require("../database/connect");
const { DataTypes } = require("sequelize");

const blockedPatient = sequelize.define("blockedPatient", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  disease: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = blockedPatient;
