const { sequelize } = require("../database/connect");
const { DataTypes } = require("sequelize");

const BlockedPatients = sequelize.define(
  "BlockedPatients",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    doctorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    patientId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  { indexes: [] }
);

module.exports = BlockedPatients;
